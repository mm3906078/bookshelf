import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookId?: string;
}

const EditCommentModal = (props: Props) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.put(
        `/comments/update/${props.bookId}`,
        { comment: commentText },
        {
          headers: { Authorization: token },
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Comment Edited Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      props.onClose();
    },
    // onError: (error: any) => {},
  });

  const editCommentHandler = () => {
    mutation.mutate();
  };

  return (
    <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <ModalHeader>Comment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            placeholder="edit your comment..."
            size="sm"
          />
          {/* <FormControl isInvalid={!!errors.author}>
                <FormLabel htmlFor="author">author</FormLabel>
                <Input
                  id="author"
                  placeholder="author"
                  {...register("author", {
                    required: "author is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.author && errors.author.message}
                </FormErrorMessage>
              </FormControl> */}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button onClick={editCommentHandler} colorScheme="yellow">
            Edit
          </Button>
        </ModalFooter>
        {/* </form> */}
      </ModalContent>
    </Modal>
  );
};

export default EditCommentModal;
