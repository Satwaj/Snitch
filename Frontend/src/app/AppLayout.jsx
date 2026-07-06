import { Outlet } from "react-router";
import Footer from "../features/shared/components/Footer";
import Navbar from "../features/shared/components/Navbar";
import WelcomeLoader from "../features/shared/components/WelcomeLoader";

const AppLayout = () => {
  return (
    <>
      <WelcomeLoader />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
