import { createBrowserRouter } from "react-router"
import Register from "../features/auth/Pages/Register"
import Login from "../features/auth/Pages/Login"
import CreateProduct from "../features/products/pages/createProduct"
import Dashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import Home from "../features/products/pages/Home"
import Productdetail from "../features/products/pages/Productdetail"
import SellerProductDetails from "../features/products/pages/SellerProductDetails"
import Cart from "../features/cart/pages/Cart"
import OrderSuccess from "../features/cart/pages/OrderSuccess"
import AppLayout from "./AppLayout"



 export const routes = createBrowserRouter([
   {
     path: "/register",
     element: <Register />,
   },
   {
     path: "/login",
     element: <Login />,
   },
   {
    element: <AppLayout/>,
     children: [
       {
         path: "/",
         element: <Home />,
       },
       {
         path: "/product/:productId",
         element: <Productdetail />,
       },
       {
         path: "/cart",
         element: <Cart />,
       },
       {
         path: "/order-success",
         element: <OrderSuccess />,
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
                 <Dashboard />
               </Protected>
             ),
           },
           {
             path: "/seller/product/:productId",
             element: (
               <Protected role="seller">
                 <SellerProductDetails />
               </Protected>
             ),
           },
         ],
       },
     ],
   },
 ]);
