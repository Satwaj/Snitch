import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addItem as addItemToCart,
    decrementCartItem,
    incrementCartItem,
    removeItem,
    setItems,
} from "../state/cart.slice.js";
import {
    addItem as addItemApi,
    getCart,
    incrementCartItemApi,
    removeCartItem,
} from "../services/cart.api.js";

const CART_STORAGE_KEY = "snitch_cart_items";

const readCachedCart = () => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const cachedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        return cachedCart ? JSON.parse(cachedCart) : [];
    } catch {
        return [];
    }
};

const writeCachedCart = (items) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Ignore storage failures and keep the in-memory cart usable.
    }
};


export const useCart = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const productDetails = useSelector((state) => state.product.productDetails);

    useEffect(() => {
        writeCachedCart(cartItems);
    }, [cartItems]);

    const handleGetCart = useCallback(async () => {
        try {
            const data = await getCart();
            const items = data?.cart?.items ?? [];
            dispatch(setItems(items));
            return items;
        } catch {
            const cachedItems = readCachedCart();
            dispatch(setItems(cachedItems));
            return cachedItems;
        }
    }, [dispatch]);

    const handleAddItem = useCallback(
        async ({ productId, variantId, quantity = 1 }) => {
            const productSnapshot =
                productDetails?._id?.toString() === productId?.toString()
                    ? productDetails
                    : null;
            const variantSnapshot =
                productSnapshot?.variants?.find(
                    (variant) => variant?._id?.toString() === variantId?.toString(),
                ) ?? null;

            dispatch(
                addItemToCart({
                    product: productSnapshot ?? { _id: productId },
                    variant: variantSnapshot ?? variantId,
                    quantity,
                    price: variantSnapshot?.price ?? productSnapshot?.price,
                }),
            );

            try {
                return await addItemApi({ productId, variantId });
            } catch (error) {
                console.error("Failed to add item to cart", error);
                return null;
            }
        },
        [dispatch, productDetails],
    );

    const handleIncrementCartItem = useCallback(
        async ({ productId, variantId }) => {
            dispatch(incrementCartItem({ productId, variantId }));

            try {
                return await incrementCartItemApi({ productId, variantId });
            } catch (error) {
                console.error("Failed to increment cart item", error);
                return null;
            }
        },
        [dispatch],
    );

    const handleDecrementCartItem = useCallback(
        ({ productId, variantId }) => {
            dispatch(decrementCartItem({ productId, variantId }));
        },
        [dispatch],
    );

    const handleRemoveCartItem = useCallback(
        async ({ productId, variantId }) => {
            dispatch(removeItem({ productId, variantId }));

            try {
                return await removeCartItem({ productId, variantId });
            } catch (error) {
                console.error("Failed to remove cart item", error);
                return null;
            }
        },
        [dispatch],
    );


    return {
        handleAddItem,
        handleGetCart,
        handleIncrementCartItem,
        handleDecrementCartItem,
        handleRemoveCartItem,
    };

}