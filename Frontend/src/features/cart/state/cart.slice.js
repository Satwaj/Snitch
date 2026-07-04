import { createSlice } from "@reduxjs/toolkit";

const getProductId = (item) => item?.product?._id ?? item?.productId ?? item?.product ?? null;
const getVariantId = (item) => item?.variant?._id ?? item?.variantId ?? item?.variant ?? null;

const normalizeCartItem = (item) => ({
    ...item,
    quantity: Number(item?.quantity ?? 1) || 1,
});

const isSameCartItem = (item, productId, variantId) => {
    const currentProductId = getProductId(item)?.toString();
    const currentVariantId = getVariantId(item)?.toString();

    return (
        currentProductId === productId?.toString() &&
        currentVariantId === variantId?.toString()
    );
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            state.items = Array.isArray(action.payload)
                ? action.payload.map(normalizeCartItem)
                : [];
        },
        addItem: (state, action) => {
            const payload = normalizeCartItem(action.payload);
            const productId = getProductId(payload);
            const variantId = getVariantId(payload);

            const existingItem = state.items.find((item) =>
                isSameCartItem(item, productId, variantId),
            );

            if (existingItem) {
                existingItem.quantity += payload.quantity;
                existingItem.product = payload.product ?? existingItem.product;
                existingItem.variant = payload.variant ?? existingItem.variant;
                existingItem.price = payload.price ?? existingItem.price;
                return;
            }

            state.items.push(payload);
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(
                (item) => !isSameCartItem(item, productId, variantId),
            );
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;

            state.items = state.items.map((item) => {
                if (isSameCartItem(item, productId, variantId)) {
                    return {
                        ...item,
                        quantity: Number(item.quantity ?? 1) + 1,
                    };
                }

                return item;
            });
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;

            state.items = state.items
                .map((item) => {
                    if (!isSameCartItem(item, productId, variantId)) {
                        return item;
                    }

                    const nextQuantity = Number(item.quantity ?? 1) - 1;

                    return nextQuantity > 0
                        ? { ...item, quantity: nextQuantity }
                        : null;
                })
                .filter(Boolean);
        },
    },
});

export const {
    setItems,
    addItem,
    incrementCartItem,
    decrementCartItem,
    removeItem,
} = cartSlice.actions;

export default cartSlice.reducer;