import { createBrowserRouter } from "react-router"
import Register from "../features/auth/Pages/Register"
import Login from "../features/auth/Pages/Login"
import CreateProduct from "../features/products/pages/createProduct"
import Dashboard from "../features/products/pages/Dashboard"



 export const routes = createBrowserRouter([
  {
      path: "/",
      element: <div>Home</div>
  },
 {
  path: "/register",
  element: <Register/>
 },
 {
  path: "/login",
  element: <Login/>
 },
 {
    path:"/seller",
    children:[

        {
            path:"/seller/create-product",
            element:<CreateProduct/>
        },
        {
            path:"/seller/dashboard",
            element:<Dashboard/>
        }

    ]
    
 }

])
