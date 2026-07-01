import { createProduct,getProducts,getAllProducts } from "../services/product.api"
import {setSellerProducts,setProducts} from "../state/product.slice"
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


return {handleCreateProduct,handleGetSellerProducts,handleGetAllProducts} 
}

