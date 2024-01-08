import { Box, Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="10px"
    >
      <Text fontWeight="600">404 Page Not Found!</Text>
      <Link as={ReactRouterLink} to="/">
        Return To Home
      </Link>
    </Box>
  );
};

export default ErrorPage;
