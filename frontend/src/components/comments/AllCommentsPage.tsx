import { Box, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AllCommentsTable from "./AllCommentsTable";

const AllCommentsPage = () => {
  const token = localStorage.getItem("token");
  const { isFetching, data } = useQuery({
    queryKey: ["comments"],
    queryFn: async (): Promise<any> => {
      const { data } = await axios.get(`/comments/list_all`, {
        headers: { Authorization: token },
      });
      return data;
    },
  });

  console.log(data);

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
      {data && data.length > 0 && <AllCommentsTable comments={data} />}
    </Box>
  );
};

export default AllCommentsPage;
