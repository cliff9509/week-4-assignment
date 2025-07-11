const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const count = await Post.countDocuments({ ...keyword, ...category });
  const posts = await Post.find({ ...keyword, ...category })
    .populate('user', 'name')
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'name')
    .populate('category', 'name')
    .populate('comments.user', 'name');

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
const createPost = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, featuredImage } = req.body;

    const post = new Post({
      user: req.user._id,
      title,
      content,
      category,
      featuredImage,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  }),
];

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, featuredImage } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
      if (post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this post');
      }

      post.title = title || post.title;
      post.content = content || post.content;
      post.category = category || post.category;
      post.featuredImage = featuredImage || post.featuredImage;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404);
      throw new Error('Post not found');
    }
  }),
];

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this post');
    }
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create new comment
// @route   POST /api/posts/:id/comments
// @access  Private
const createPostComment = [
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
      const comment = {
        user: req.user._id,
        text,
      };

      post.comments.push(comment);
      await post.save();
      res.status(201).json({ message: 'Comment added' });
    } else {
      res.status(404);
      throw new Error('Post not found');
    }
  }),
];


module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createPostComment,
};