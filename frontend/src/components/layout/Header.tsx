import { Box, Button, Link } from "@chakra-ui/react";
import { NavLink as ReactRouterLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexBasis="70px"
        px="20px"
        borderBottom="1px solid gray"
        backgroundColor="white"
      >
        <Button onClick={logoutHandler}>Logout</Button>

        <Box display="flex" alignItems="center" gap="10px">
          {role === "user" && (
            <Link
              borderRadius="5px"
              padding="10px 20px"
              bg="gray.100"
              color="green"
              as={ReactRouterLink}
              to="/orders"
            >
              My Orders
            </Link>
          )}
          {role === "admin" && (
            <Link
              borderRadius="5px"
              padding="10px 20px"
              bg="gray.100"
              color="green"
              as={ReactRouterLink}
              to="/users"
            >
              Users
            </Link>
          )}
          {role === "admin" && (
            <Link
              borderRadius="5px"
              padding="10px 20px"
              bg="gray.100"
              color="green"
              as={ReactRouterLink}
              to="/allcomments"
            >
              Comments
            </Link>
          )}
          <Link
            borderRadius="5px"
            padding="10px 20px"
            bg="gray.100"
            color="green"
            as={ReactRouterLink}
            to="/store"
          >
            Home
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Header;
