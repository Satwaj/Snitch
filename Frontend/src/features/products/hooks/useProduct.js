import { createProduct,getProducts,getAllProducts,getProductDetails } from "../services/product.api"
import {setSellerProducts,setProducts,setProductDetails} from "../state/product.slice"
import { useDispatch } from "react-redux"

export const useProduct = () => {

  const dispatch = useDispatch()

 async function handleCreateProduct(formData){
  const data = await  createProduct(formData)
  return data.product
}


 async function handleGetSellerProducts(formData){
  const data = await getProducts(formData)
  dispatch(setSellerProducts(data.products))
  return data.products  

}

async function handleGetAllProducts(){
  const data = await getAllProducts()
  dispatch(setProducts(data.products))
  return data.products
}

async function handleGetProductById(productId){
  const data = await getProductDetails(productId)
  dispatch(setProductDetails(data.product))
  return data.product
}



return {handleCreateProduct,handleGetSellerProducts,handleGetAllProducts,handleGetProductById} 
}

