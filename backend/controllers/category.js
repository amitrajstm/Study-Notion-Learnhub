const mongoose = require("mongoose");
const Category = require("../models/category");

// Utility function to get a random integer up to max
const getRandomInt = (max) => Math.floor(Math.random() * max);

// ====================================================================
//                          Create Category (Admin Only)
// ====================================================================
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await Category.create({ name, description });

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error while creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ====================================================================
//                          Show All Categories
// ====================================================================
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: allCategories,
    });
  } catch (error) {
    console.error("Error while fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ====================================================================
//                Get Category Page Details by ID
// ====================================================================
exports.getCategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Parallel fetches
    const [selectedCategory, categoriesExceptSelected, allCategories] = await Promise.all([
      Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        }),
      Category.find({ _id: { $ne: categoryId } }),
      Category.find().populate({
        path: "courses",
        match: { status: "Published" },
        populate: "instructor",
      }),
    ]);

    // Validate selected category
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found in the selected category",
      });
    }

    // Get a random different category
    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomCategoryId = categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]?._id;
      differentCategory = await Category.findById(randomCategoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
        });
    }

    // Top 10 best-selling published courses
    const allCourses = allCategories.flatMap((cat) => cat.courses || []);
    const mostSellingCourses = allCourses
      .filter((course) => course && typeof course.sold === "number")
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("Error in getCategoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const Category = require('../models/category')

// // get Random Integer
// function getRandomInt(max) {
//     return Math.floor(Math.random() * max)
// }

// // ================ create Category ================
// exports.createCategory = async (req, res) => {
//     try {
//         // extract data
//         const { name, description } = req.body;

//         // validation
//         if (!name || !description) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }

//         const categoryDetails = await Category.create({
//             name: name, description: description
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Category created successfully'
//         });
//     }
//     catch (error) {
//         console.log('Error while creating Category');
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Error while creating Category',
//             error: error.message
//         })
//     }
// }


// // ================ get All Category ================
// exports.showAllCategories = async (req, res) => {
//     try {
//         // get all category from DB
//         const allCategories = await Category.find({}, { name: true, description: true });

//         // return response
//         res.status(200).json({
//             success: true,
//             data: allCategories,
//             message: 'All allCategories fetched successfully'
//         })
//     }
//     catch (error) {
//         console.log('Error while fetching all allCategories');
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Error while fetching all allCategories'
//         })
//     }
// }



// // ================ Get Category Page Details ================
// exports.getCategoryPageDetails = async (req, res) => {
//     try {
//         const { categoryId } = req.body
//         // console.log("PRINTING CATEGORY ID: ", categoryId);

//         // Get courses for the specified category
//         const selectedCategory = await Category.findById(categoryId)
//             .populate({
//                 path: "courses",
//                 match: { status: "Published" },
//                 populate: "ratingAndReviews",
//             })
//             .exec()

//         // console.log('selectedCategory = ', selectedCategory)
//         // Handle the case when the category is not found
//         if (!selectedCategory) {
//             // console.log("Category not found.")
//             return res.status(404).json({ success: false, message: "Category not found" })
//         }



//         // Handle the case when there are no courses
//         if (selectedCategory.courses.length === 0) {
//             // console.log("No courses found for the selected category.")
//             return res.status(404).json({
//                 success: false,
//                 data: null,
//                 message: "No courses found for the selected category.",
//             })
//         }

//         // Get courses for other categories
//         const categoriesExceptSelected = await Category.find({
//             _id: { $ne: categoryId },
//         })

//         let differentCategory = await Category.findOne(
//             categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//                 ._id
//         )
//             .populate({
//                 path: "courses",
//                 match: { status: "Published" },
//             })
//             .exec()

//         //console.log("Different COURSE", differentCategory)
//         // Get top-selling courses across all categories
//         const allCategories = await Category.find()
//             .populate({
//                 path: "courses",
//                 match: { status: "Published" },
//                 populate: {
//                     path: "instructor",
//                 },
//             })
//             .exec()

//         const allCourses = allCategories.flatMap((category) => category.courses)
//         const mostSellingCourses = allCourses
//             .sort((a, b) => b.sold - a.sold)
//             .slice(0, 10)

//         // console.log("mostSellingCourses COURSE", mostSellingCourses)
//         res.status(200).json({
//             success: true,
//             data: {
//                 selectedCategory,
//                 differentCategory,
//                 mostSellingCourses,
//             },
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         })
//     }
// }