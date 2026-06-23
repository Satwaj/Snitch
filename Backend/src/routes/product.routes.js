import express from "express";
import {authenticateSeller} from "../middlewares/auth.middleware.js"
import multer from "multer"
import { createProduct,getSellerProducts } from "../controllers/product.controller.js";
import { createProductValidator } from "../validators/product.validator.js";





const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})




const router = express.Router()


/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */

router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

// router.post(
//   "/",
//   upload.array("images", 7),
//   (req, res) => {
//     res.json({ success: true });
//   }
// );

/** 
 * @route GET /api/products/seller
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
router.get("/seller", authenticateSeller, getSellerProducts)



/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */




/**
 * @route GET /api/products/detail/:id
 * @description Get product details by ID
 * @access Public
 */




/**
 * @route post /api/products/:productId/variants
 * @description Add a new variant to a product
 * @access Private (Seller only)
 */



export default router

