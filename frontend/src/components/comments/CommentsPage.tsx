import { Button, useDisclosure } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import AddCommentModal from "./AddCommentModal";

const CommentsPage = () => {
  const token = localStorage.getItem("token");
  const params = useParams();
  const { isFetching, data } = useQuery({
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

  console.log(data);

  return (
    <>
      <Button onClick={onOpenAddCommentModal}>Add Comment</Button>
      
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

export default CommentsPage;
