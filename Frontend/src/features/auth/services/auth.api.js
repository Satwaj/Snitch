import axios  from "axios";


export const api = axios.create({
  baseURL:"/api/auth",
  withCredentials:true,
})


 export async function register({email,password,contact,fullname,isSeller=false}) {

  const res =  await api.post('/register',{email,password,contact,fullname,isSeller})

  return res.data
  
}


export async function login ({email,password}) {

  const res = await api.post('/login',{email,password})

  return res.data
}