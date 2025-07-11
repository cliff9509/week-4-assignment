const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createPostComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload'); // For image uploads

router.route('/').get(getPosts).post(protect, createPost);
router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.route('/:id/comments').post(protect, createPostComment);

// Route for image upload (example)
router.post('/upload', protect, upload.single('image'), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;