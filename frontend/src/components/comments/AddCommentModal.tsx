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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookId?: string;
}

const AddCommentModal = (props: Props) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const [commentText, setCommentText] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(
        `/comments/add/${props.bookId}`,
        { comment: commentText },
        {
          headers: { Authorization: token },
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Comment Submitted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      props.onClose();
    },
    // onError: (error: any) => {},
  });

  const addCommentHandler = () => {
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
            placeholder="write your comment..."
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
          <Button onClick={addCommentHandler} colorScheme="green">
            Submit
          </Button>
        </ModalFooter>
        {/* </form> */}
      </ModalContent>
    </Modal>
  );
};

export default AddCommentModal;
