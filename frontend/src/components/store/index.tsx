import {
  Box,
  Button,
  Spinner,
  Text
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Book } from "../../models/models";
import BooksTable from "./books/BooksTable";


const Store = () => {
  const { refetch, isFetching, data } = useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<Book[]> => {
      const { data } = await axios.get("/books/list");
      return data;
    },
  });

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {!isFetching && data?.length === 0 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="10px"
        >
          <Text color="white" fontWeight="700" fontSize="46px">
            No Books Yet!
          </Text>
          <Button
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
  );
};

export default Store;
