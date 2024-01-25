import {
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  OrderedList,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  authorName?: string;
  bookName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const SearchBookModal = (props: Props) => {
  const token = localStorage.getItem("token");

  const [result, setResult] = useState([]);
  const mutation = useMutation({
    mutationFn: () => {
      let body = {};
      if (props.authorName) {
        body = {
          author: props.authorName,
        };
      }
      if (props.bookName) {
        body = {
          title: props.bookName,
        };
      }
      return axios.post("/books/search", body, {
        headers: { Authorization: token },
      });
    },
    onSuccess: (res) => {
      setResult(res.data);
    },
    // onError: (error: any) => {},
  });

  useEffect(() => {
    mutation.mutate();
  }, []);

  console.log(result);

  return (
    <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <ModalHeader>Search Result</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <OrderedList>
            {result &&
              result.map((book: any) => <ListItem>{book.title}</ListItem>)}
          </OrderedList>
        </ModalBody>

        {/* </form> */}
      </ModalContent>
    </Modal>
  );
};

export default SearchBookModal;
