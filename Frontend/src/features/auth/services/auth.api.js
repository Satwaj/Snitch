import axios  from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
});


 export async function register({email,password,contact,fullname,isSeller=false}) {

  const res =  await api.post('/register',{email,password,contact,fullname,isSeller})

  return res.data
  
}


export async function login ({email,password}) {

  const res = await api.post('/login',{email,password})

  return res.data
}

export async function logout () {
  const res = await api.post('/logout')
  return res.data
}

export async function getMe () {
  const res = await api.get('/me')
  return res.data
}

