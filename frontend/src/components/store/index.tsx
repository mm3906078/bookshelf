import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Book } from "../../models/models";
import AddBookModal from "./books/AddBookModal";
import BooksTable from "./books/BooksTable";
import SearchBookModal from "./books/SearchBookModal";

const Store = () => {
  const role = localStorage.getItem("role");
  const {
    isOpen: isAddBookModalOpen,
    onOpen: onOpenAddBookModal,
    onClose: onCloseAddBookModal,
  } = useDisclosure();
  const {
    isOpen: isSearchModalOpen,
    onOpen: onOpenSearchModal,
    onClose: onCloseSearchModal,
  } = useDisclosure();
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const { refetch, isFetching, data } = useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<Book[]> => {
      const { data } = await axios.get("/books/list");
      return data;
    },
  });

  // const mutation = useMutation({
  //   mutationFn: () => {
  //     return axios.post("/books/search", {
  //       author: authorName,
  //       title: bookName,
  //     });
  //   },
  //   onSuccess: (res) => {
  //     console.log(res);
  //   },
  // });

  if (isFetching) {
    return (
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Box bg="white" padding="20px" borderRadius="10px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="20px"
            gap="10px"
          >
            {role === "admin" && (
              <Button color="green" onClick={onOpenAddBookModal}>
                Add Book
              </Button>
            )}
            <Box display="flex" alignItems="center" gap="10px">
              <Input
                value={bookName}
                onChange={(e) => {
                  setBookName(e.target.value);
                  setAuthorName("");
                }}
                placeholder="Book name"
              />
              <Input
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  setBookName("");
                }}
                placeholder="Author name"
              />
              <Button padding="10px 40px" onClick={onOpenSearchModal}>
                Search
              </Button>
            </Box>
          </Box>

          {!isFetching && data?.length === 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap="10px"
            >
              <Text fontWeight="700" fontSize="46px">
                No Books Yet!
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => {
                  refetch();
                }}
              >
                Refetch
              </Button>
            </Box>
          )}
          {data && data.length > 0 && <BooksTable books={data} />}
        </Box>
      </Box>

      {isAddBookModalOpen && (
        <AddBookModal
          isOpen={isAddBookModalOpen}
          onClose={onCloseAddBookModal}
        />
      )}
      {isSearchModalOpen && (
        <SearchBookModal
          isOpen={isSearchModalOpen}
          onClose={onCloseSearchModal}
          authorName={authorName}
          bookName={bookName}
        />
      )}
    </>
  );
};

export default Store;
