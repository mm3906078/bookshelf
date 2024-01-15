import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

type BookValues = {
  author: string;
  genre: string;
  title: string;
  year: string;
  price: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddBookModal = (props: Props) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<BookValues>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: BookValues) => {
      return axios.post("/books/add", values, {
        headers: { Authorization: token },
      });
    },
    onSuccess: (res) => {
      toast({
        title: "Book Added Successfully!",
        description: `Book Added with id of ${res.data.book_id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      props.onClose();
    },
    // onError: (error: any) => {},
  });

  const onSubmit: SubmitHandler<BookValues> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.author}>
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
            </FormControl>
            <FormControl mt="10px" isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">title</FormLabel>
              <Input
                id="title"
                placeholder="title"
                {...register("title", {
                  required: "title is required",
                })}
              />
              <FormErrorMessage>
                {errors.title && errors.title.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt="10px" isInvalid={!!errors.genre}>
              <FormLabel htmlFor="genre">genre</FormLabel>
              <Input
                id="genre"
                placeholder="genre"
                {...register("genre", {
                  required: "genre is required",
                })}
              />
              <FormErrorMessage>
                {errors.genre && errors.genre.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt="10px" isInvalid={!!errors.year}>
              <FormLabel htmlFor="year">year</FormLabel>
              <Input
                id="year"
                placeholder="year"
                {...register("year", {
                  required: "year is required",
                })}
              />
              <FormErrorMessage>
                {errors.year && errors.year.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt="10px" isInvalid={!!errors.price}>
              <FormLabel htmlFor="price">price</FormLabel>
              <Input
                id="price"
                placeholder="price"
                {...register("price", {
                  required: "price is required",
                })}
              />
              <FormErrorMessage>
                {errors.price && errors.price.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={props.onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="green">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddBookModal;
