import { Box } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import MainBg from "../../assets/images/bg.jpg";
import Header from "../layout/Header";

const Layout = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      backgroundImage={`url(${MainBg})`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
      height="100vh"
      width="100%"
      display="flex"
      flexDirection="column"
    >
      <Header />

      <Box as="main" flexGrow="1">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
