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
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Comment } from "../../models/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import EditCommentModal from "./EditCommentModal";

interface Props {
  comments: Comment[];
}

const BookCommentsTable = (props: Props) => {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const cancelRef = useRef(null);

  const {
    isOpen: isDeleteCommentConfirmOpen,
    onOpen: onOpenDeleteCommentConfirm,
    onClose: onCloseDeleteCommentConfirm,
  } = useDisclosure();

  const {
    isOpen: isEditCommentModalOpen,
    onOpen: onOpenEditCommentModal,
    onClose: onCloseEditCommentModal,
  } = useDisclosure();

  const [selectedCommentBookId, setSelectedCommentBookId] = useState("");
  const queryClient = useQueryClient();

  const toast = useToast();
  const deleteCommentMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/comments/delete/${selectedCommentBookId}`, {
        headers: { Authorization: token },
      });
    },
    onSuccess: (res) => {
      onCloseDeleteCommentConfirm();
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast({
        title: "Comment Deleted!",
        description: `comment deleted with id of ${res.data.book_id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <>
      <TableContainer
        overflowY="auto"
        overflowX="hidden"
        borderRadius="10px"
        bg="aliceblue"
        maxHeight="500px"
        mx="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>book_id</Th>
              <Th>user_id</Th>
              <Th>Comment Text</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.comments?.map((comment) => (
              <Tr>
                <Td>{comment.book_id}</Td>
                <Td>{comment.user_id}</Td>
                <Td>
                  <Text>{comment.comment}</Text>
                </Td>

                {comment.user_id === userId && (
                  <Td>
                    <Button
                      onClick={() => {
                        onOpenDeleteCommentConfirm();
                        setSelectedCommentBookId(comment.book_id);
                      }}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                    <Button
                      marginLeft="10px"
                      onClick={() => {
                        setSelectedCommentBookId(comment.book_id);
                        onOpenEditCommentModal();
                      }}
                      colorScheme="yellow"
                    >
                      Edit
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {isDeleteCommentConfirmOpen && (
        <AlertDialog
          isCentered
          isOpen={isDeleteCommentConfirmOpen}
          leastDestructiveRef={cancelRef}
          onClose={onCloseDeleteCommentConfirm}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Comment
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCloseDeleteCommentConfirm}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    deleteCommentMutation.mutate();
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

      {isEditCommentModalOpen && (
        <EditCommentModal
          isOpen={isEditCommentModalOpen}
          onClose={onCloseEditCommentModal}
          bookId={selectedCommentBookId}
        />
      )}
    </>
  );
};

export default BookCommentsTable;
