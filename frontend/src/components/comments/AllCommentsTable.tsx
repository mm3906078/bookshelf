import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { AdminComment } from "../../models/models";

interface Props {
  comments: AdminComment[];
}

const AllCommentsTable = (props: Props) => {

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
              <Th>user_id</Th>
              <Th>Comment Text</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.comments?.map((comment) => (
              <Tr>
                <Td>{comment.book_id}</Td>
                <Td>{comment.user_id}</Td>
                <Td>
                  <Text>{comment.comment}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AllCommentsTable;
