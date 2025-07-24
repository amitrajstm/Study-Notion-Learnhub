const express = require('express');
const router = express.Router();

// Import Controllers
const {
  createCategory,
  showAllCategories,
  getCategoryPageDetails,
} = require('../controllers/category');

// Import Middlewares
const { auth, isAdmin } = require('../middleware/auth');

// ===================================================================
//                        CATEGORY ROUTES
// ===================================================================

// @route   POST /api/v1/category/createCategory
// @desc    Create a new category (Admin only)
// @access  Private
router.post('/createCategory', auth, isAdmin, createCategory);

// @route   GET /api/v1/category/showAllCategories
// @desc    Get all categories
// @access  Public
router.get('/showAllCategories', showAllCategories);

// @route   POST /api/v1/category/getCategoryPageDetails
// @desc    Get details for a specific category page (with top-selling, other categories, etc.)
// @access  Public
router.post('/getCategoryPageDetails', getCategoryPageDetails);

module.exports = router;
