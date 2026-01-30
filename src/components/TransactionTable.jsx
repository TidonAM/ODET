import React from "react";
import {
  Table,
  Badge,
  Text,
  Box,
  Spinner,
  Center,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
// Correct import:
import { useData } from "../contexts/DataContext";
import { formatCurrency } from "../lib/helpers";

const TransactionTable = ({ onEdit, onDelete }) => {
  const { transactions, loading } = useData();

  if (loading) {
    return (
      <Center p={8}>
        <Spinner color="blue.500" />
      </Center>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      overflow="hidden"
      bg="white"
      shadow="sm"
    >
      <Table.Root size="sm" interactive striped={false}>
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader color="gray.500">Date</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">Category</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">From</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">To</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500">Desc</Table.ColumnHeader>
            <Table.ColumnHeader color="gray.500" textAlign="end">
              Price
            </Table.ColumnHeader>
            <Table.ColumnHeader w="80px" textAlign="right">
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactions.map((tx) => {
            const isCreditSpend = tx.neg_acc?.is_credit;

            return (
              <Table.Row
                key={tx.id}
                bg={isCreditSpend ? "red.50" : undefined}
                _hover={{ bg: isCreditSpend ? "red.100" : "gray.50" }}
              >
                {/* DATE */}
                <Table.Cell color="gray.600" fontSize="sm">
                  {tx.date}
                </Table.Cell>

                {/* CATEGORY (Fixed Color) */}
                <Table.Cell>
                  {tx.categories ? (
                    <Badge
                      variant="subtle"
                      bg={tx.categories.color + "20"} // 20% opacity background
                      color={tx.categories.color} // Full color text
                      borderWidth="1px"
                      borderColor={tx.categories.color + "40"}
                    >
                      {tx.categories.title}
                    </Badge>
                  ) : (
                    <Text fontSize="xs" color="gray.400">
                      -
                    </Text>
                  )}
                </Table.Cell>

                {/* FROM ACCOUNT (Now Colored) */}
                <Table.Cell>
                  {tx.neg_acc ? (
                    <Badge
                      variant="outline"
                      color={tx.neg_acc.color}
                      borderColor={tx.neg_acc.color}
                      size="sm"
                    >
                      {tx.neg_acc.title}
                    </Badge>
                  ) : (
                    <Text fontSize="xs" color="gray.400">
                      -
                    </Text>
                  )}
                </Table.Cell>

                {/* TO ACCOUNT (Now Colored) */}
                <Table.Cell>
                  {tx.pos_acc ? (
                    <Badge
                      variant="outline"
                      color={tx.pos_acc.color}
                      borderColor={tx.pos_acc.color}
                      size="sm"
                    >
                      {tx.pos_acc.title}
                    </Badge>
                  ) : (
                    <Text fontSize="xs" color="gray.400">
                      -
                    </Text>
                  )}
                </Table.Cell>

                {/* DESCRIPTION */}
                <Table.Cell>
                  <Text isTruncated maxW="150px" color="gray.500">
                    {tx.description || "-"}
                  </Text>
                </Table.Cell>

                {/* PRICE */}
                <Table.Cell textAlign="end">
                  <Box>
                    <Text fontWeight="bold">{formatCurrency(tx.price)}</Text>
                    {tx.service_fee > 0 && (
                      <Text fontSize="xs" color="red.500">
                        + {formatCurrency(tx.service_fee)}
                      </Text>
                    )}
                  </Box>
                </Table.Cell>

                {/* ACTIONS */}
                <Table.Cell textAlign="end">
                  <HStack gap={1} justify="flex-end">
                    <IconButton
                      aria-label="Edit"
                      size="xs"
                      variant="ghost"
                      color="blue.600"
                      onClick={() => onEdit(tx)}
                    >
                      <IoPencilOutline />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      size="xs"
                      variant="ghost"
                      color="red.600"
                      onClick={() => onDelete(tx.id)}
                    >
                      <IoTrashOutline />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default TransactionTable;
