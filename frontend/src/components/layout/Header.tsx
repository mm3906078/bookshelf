import { Box, Button, Input, Link, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { NavLink as ReactRouterLink, useNavigate } from "react-router-dom";
import AddBookModal from "../store/books/AddBookModal";

const Header = () => {
  const role = localStorage.getItem("role");
  const {
    isOpen: isAddBookModalOpen,
    onOpen: onOpenAddBookModal,
    onClose: onCloseAddBookModal,
  } = useDisclosure();
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const navigate = useNavigate();
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
        <Box display="flex" alignItems="center" gap="10px">
          <Button onClick={logoutHandler}>Logout</Button>
          {role === "admin" && (
            <Button color="green" onClick={onOpenAddBookModal}>
              Add Book
            </Button>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap="10px">
          <Input
            value={bookName}
            onChange={(e) => {
              setBookName(e.target.value);
            }}
            placeholder="Book name"
          />
          <Input
            value={authorName}
            onChange={(e) => {
              setAuthorName(e.target.value);
            }}
            placeholder="Author name"
          />
          <Button padding="10px 40px" onClick={() => {}}>
            Search
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <Link
            borderRadius="5px"
            padding="10px 20px"
            bg="gray.100"
            color="green"
            as={ReactRouterLink}
            to="/orders"
          >
            Orders
          </Link>
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
      {isAddBookModalOpen && (
        <AddBookModal
          isOpen={isAddBookModalOpen}
          onClose={onCloseAddBookModal}
        />
      )}
    </>
  );
};

export default Header;
