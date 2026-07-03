import { createProduct,getProducts,getAllProducts,getProductDetails,addProductVariant,deleteProduct,deleteProductVariant} from "../services/product.api"
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

async function handleAddProductVariant(productId, newProductvariant){
  const data = await addProductVariant(productId, newProductvariant)
  return data
}

async function handleDeleteProduct(productId) {
  const data = await deleteProduct(productId)
  return data
}

async function handleDeleteProductVariant(productId, variantId) {
  const data = await deleteProductVariant(productId, variantId)
  return data
}

return {handleCreateProduct,handleGetSellerProducts,handleGetAllProducts,handleGetProductById,handleAddProductVariant,deleteProduct: handleDeleteProduct,deleteProductVariant: handleDeleteProductVariant} 
}

