import { Box, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Order } from "../../models/models";
import OrdersTable from "./OrdersTable";

const OrdersPage = () => {
  const token = localStorage.getItem("token");
  const { isFetching, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data } = await axios.get("/orders/list", {
        headers: { Authorization: token },
      });
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
      {data && data.length > 0 && <OrdersTable orders={data} />}
    </Box>
  );
};

export default OrdersPage;
