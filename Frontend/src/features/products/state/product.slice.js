import { createSlice } from '@reduxjs/toolkit';


const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    selectedCategory: "ALL",
    searchQuery: "",
    isSearchOpen: false
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload
    },
    setProducts: (state, action) => {
      state.products = action.payload
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload
    }
  }

})

export const { setSellerProducts, setProducts, setProductDetails, setSelectedCategory, setSearchQuery, setSearchOpen } = productSlice.actions
export default productSlice.reducer