const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { body, validationResult } = require('express-validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      res.status(400);
      throw new Error('Category with this name already exists');
    }

    const category = new Category({
      name,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  }),
];

module.exports = {
  getCategories,
  createCategory,
};