import {createSlice} from '@reduxjs/toolkit';


const productSlice = createSlice({
  name:"product",
  initialState:{
    sellerProducts:[],
    products:[]
  },
  reducers:{
    setSellerProducts:(state,action)=>{
      state.sellerProducts = action.payload
    },
    setProducts:(state,action)=>{
      state.products = action.payload
    },
    setProductDetails:(state,action)=>{
      state.productDetails = action.payload
    }
  }

})

export const {setSellerProducts, setProducts, setProductDetails} = productSlice.actions
export default productSlice.reducer