import axios from "axios"


 const productApiInstance = axios.create({
  baseURL:"/api/products",
  withCredentials:true,
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

