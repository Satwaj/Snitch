import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

 const productApiInstance = axios.create({
  baseURL: `${API_URL}/api/products`,
  withCredentials: true,
})

export  async function createProduct (formData){
  const res = await productApiInstance.post("/",formData,{
    headers:{
      "Content-Type":"multipart/form-data"  
    }
  })
  return res.data
}


export async function getProducts (formData) {

  const res = await productApiInstance.get("/seller",formData,{
    headers:{
      "Content-Type":"multipart/form-data"
    }
})
  return res.data
}

export async function getAllProducts (){
  const res = await productApiInstance.get("/")
  return res.data
}


export async function getProductDetails (productId){
  const res = await productApiInstance.get(`/detail/${productId}`)
  return res.data
}



export async function addProductVariant(productId, newProductVariant) {

    console.log(newProductVariant)

    const formData = new FormData()

    newProductVariant.images.forEach((image) => {
        formData.append(`images`, image.file)
    })

    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)

    return response.data

}

export async function deleteProduct(productId) {
    const response = await productApiInstance.post(`/${productId}/delete`)
    return response.data
}

export async function deleteProductVariant(productId, variantId) {
    const response = await productApiInstance.post(`/${productId}/variants/delete/${variantId}`)
    return response.data
}

