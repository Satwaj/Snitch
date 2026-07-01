import { createBrowserRouter } from "react-router"
import Register from "../features/auth/Pages/Register"
import Login from "../features/auth/Pages/Login"
import CreateProduct from "../features/products/pages/createProduct"
import Dashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import Home from "../features/products/pages/Home"



 export const routes = createBrowserRouter([
   {
     path: "/",
     element: <Home/>,
   },
   {
     path: "/register",
     element: <Register />,
   },
   {
     path: "/login",
     element: <Login />,
   },
   {
     path: "/seller",
     children: [
       {
         path: "/seller/create-product",
         element: (
           <Protected role="seller">
             <CreateProduct />
           </Protected>
         ),
       },

       {
         path: "/seller/dashboard",
         element: (
           <Protected role="seller">
            <Dashboard/>
           </Protected>
         ),
       },
     ],
   },
 ]);
