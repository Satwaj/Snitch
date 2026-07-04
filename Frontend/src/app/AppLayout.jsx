import {Outlet} from "react-router";
import Footer from "../features/shared/components/Footer";
import Navbar from "../features/shared/components/Navbar";


const AppLayout = () => {

  return (
   <>
   <Navbar/>
    <Outlet/>
    <Footer/>
   </>
  )
}

export default AppLayout
