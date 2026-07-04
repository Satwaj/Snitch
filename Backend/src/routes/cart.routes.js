import express from "express";
import {authenticateSeller,authenticateUser} from "../middlewares/auth.middleware.js"
import { validateAddToCart } from "../validators/cart.validator.js";
import { addToCart,getCart } from "../controllers/cart.controller.js";



const router = express.Router()

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */



router.post("/add/:productId/:variantId",authenticateUser, validateAddToCart, addToCart)

/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */

router.get("/",authenticateUser, getCart)






/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment item quantity in cart by one
 * @access Private
 * @argument productId - ID of the product to update
 * @argument variantId - ID of the variant to update
 */




/**
 * @route POST /api/cart/payment/create/order
 */


export default router;  