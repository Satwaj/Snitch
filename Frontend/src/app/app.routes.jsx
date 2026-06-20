import { createBrowserRouter } from "react-router"
import Register from "../features/auth/Pages/Register"
import Login from "../features/auth/Pages/Login"



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
 }

])
