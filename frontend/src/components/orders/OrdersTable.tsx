import {
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Order } from "../../models/models";

interface Props {
  orders: Order[];
}

const OrdersTable = (props: Props) => {
  const role = localStorage.getItem("role");

  return (
    <>
      <TableContainer
        overflowY="auto"
        overflowX="hidden"
        borderRadius="10px"
        bg="aliceblue"
        maxWidth="80%"
        maxHeight="500px"
        mx="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>book_id</Th>
              <Th>order_date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.orders?.map((order) => (
              <Tr>
                <Td>{order.book_id}</Td>
                <Td>{order.order_date}</Td>
                {role === "user" && (
                  <Td>
                    <Link
                      as={ReactRouterLink}
                      colorScheme="blue"
                      to={`/comments/${order.book_id}`}
                    >
                      Comments
                    </Link>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrdersTable;
