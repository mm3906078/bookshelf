import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { Order, User } from "../../models/models";
import AddCommentModal from "../comments/AddCommentModal";
import { Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

interface Props {
  users: User[];
}

const UsersTable = (props: Props) => {
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
              <Th>user_id</Th>
              <Th>name</Th>
              <Th>family</Th>
              <Th>email</Th>
              <Th>role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.users?.map((user) => (
              <Tr>
                <Td>{user.user_id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.family}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
