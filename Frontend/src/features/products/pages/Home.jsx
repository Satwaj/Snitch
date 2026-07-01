import {useSelector} from "react-redux"
import { useEffect } from "react"
import { useProduct } from "../hooks/useProduct"

const Home = () => {

const products = useSelector((state)=>state.product.products)
const {handleGetAllProducts} = useProduct()

useEffect(()=>{
  handleGetAllProducts()
},[])

console.log(products)

  return (
    <div>
      
    </div>
  )
}

export default Home
