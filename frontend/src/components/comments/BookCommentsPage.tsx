import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddCommentModal from "./AddCommentModal";
import BookCommentsTable from "./BookCommentsTable";

const BookCommentsPage = () => {
  const token = localStorage.getItem("token");
  const params = useParams();
  const { data } = useQuery({
    queryKey: ["comments"],
    queryFn: async (): Promise<any> => {
      const { data } = await axios.get(`/comments/list/${params.bookid}`, {
        headers: { Authorization: token },
      });
      return data;
    },
  });

  const {
    isOpen: isAddCommentModalOpen,
    onOpen: onOpenAddCommentModal,
    onClose: onCloseAddCommentModal,
  } = useDisclosure();

  return (
    <>
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          alignItems="flex-start"
          background="white"
          padding="20px"
          borderRadius="10px"
        >
          <Button colorScheme="green" onClick={onOpenAddCommentModal}>
            Add Comment
          </Button>
          {data && data.length > 0 && <BookCommentsTable comments={data} />}
        </Box>
      </Box>

      {isAddCommentModalOpen && (
        <AddCommentModal
          isOpen={isAddCommentModalOpen}
          onClose={onCloseAddCommentModal}
          bookId={params.bookid}
        />
      )}
    </>
  );
};

export default BookCommentsPage;
