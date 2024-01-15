import {
    Button,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import { Order } from "../../models/models";
import AddCommentModal from "../comments/AddCommentModal";

interface Props {
  orders: Order[];
}

const OrdersTable = (props: Props) => {
  const role = localStorage.getItem("role");
  const {
    isOpen: isCommentModalOpen,
    onOpen: onOpenCommentModal,
    onClose: onCloseCommentModal,
  } = useDisclosure();

  const [selectedOrderBookId, setSelectedOrderBookId] = useState("");
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
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedOrderBookId(order.book_id);
                        onOpenCommentModal();
                      }}
                    >
                      Comment
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {isCommentModalOpen && (
        <AddCommentModal
          isOpen={isCommentModalOpen}
          onClose={onCloseCommentModal}
          bookId={selectedOrderBookId}
        />
      )}
    </>
  );
};

export default OrdersTable;
