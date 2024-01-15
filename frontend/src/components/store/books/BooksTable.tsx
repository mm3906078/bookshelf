import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { Book } from "../../../models/models";

interface Props {
  books: Book[];
}

const BooksTable = (props: Props) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const {
    isOpen: isDeleteBookConfirmOpen,
    onOpen: onOpenDeleteBookConfirm,
    onClose: onCloseDeleteBookConfirm,
  } = useDisclosure();
  const toast = useToast();
  const cancelRef = useRef(null);
  const [selectedBookId, setSelectedBookId] = useState("");

  const queryClient = useQueryClient();
  const deleteBookMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/books/delete/${selectedBookId}`, {
        headers: { Authorization: token },
      });
    },
    onSuccess: (res) => {
      onCloseDeleteBookConfirm();
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: "Book Deleted!",
        description: `book deleted with id of ${res.data.book_id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });
  const orderBookMutation = useMutation({
    mutationFn: (bookId: string) => {
      return axios.post(`/books/order/${bookId}`, null, {
        headers: { Authorization: token },
      });
    },
    onSuccess: (res) => {
      toast({
        title: "Book Ordered!",
        description: `book ordered with id of ${res.data.book_id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const orderBookHandler = (bookId: string) => {
    orderBookMutation.mutate(bookId);
  };

  return (
    <>
      <TableContainer
        overflowY="auto"
        overflowX="hidden"
        borderRadius="10px"
        bg="aliceblue"
        maxWidth="80%"
        maxHeight="500px"
        mx="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Year</Th>
              <Th>Author</Th>
              <Th>Genre</Th>
              <Th>Price</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.books?.map((book) => (
              <Tr>
                <Td>{book.title}</Td>
                <Td>{book.year}</Td>
                <Td>{book.author}</Td>
                <Td>{book.genre}</Td>
                <Td>{book.price}</Td>
                {role === "admin" && (
                  <Td>
                    <Button
                      onClick={() => {
                        onOpenDeleteBookConfirm();
                        setSelectedBookId(book.book_id);
                      }}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </Td>
                )}
                {role === "user" && (
                  <Td>
                    <Button
                      colorScheme="green"
                      onClick={() => {
                        orderBookHandler(book.book_id);
                      }}
                    >
                      Order
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {isDeleteBookConfirmOpen && (
        <AlertDialog
          isCentered
          isOpen={isDeleteBookConfirmOpen}
          leastDestructiveRef={cancelRef}
          onClose={onCloseDeleteBookConfirm}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Book
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteBookConfirm}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteBookMutation.mutate();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default BooksTable;
