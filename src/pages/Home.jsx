import React, { useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Button,
  HStack,
  Box,
  Spinner,
  Center,
  Text,
  NativeSelect,
} from "@chakra-ui/react";
import TotalsSection from "../components/TotalsSection";
import TransactionTable from "../components/TransactionTable";
import AddTransactionModal from "../components/AddTransactionModal";
import { useData } from "../contexts/DataContext";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const {
    resets,
    currentResetId,
    switchReset,
    performReset,
    loading,
    deleteTransaction,
  } = useData();

  const handleAdd = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tx) => {
    setTransactionToEdit(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this transaction? This cannot be undone.",
      )
    ) {
      await deleteTransaction(id);
    }
  };

  const handleResetChange = (e) => {
    switchReset(e.target.value);
  };

  if (loading && !isModalOpen && !currentResetId) {
    return (
      <Center h="80vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text ml={4} fontSize="lg" fontWeight="medium" color="gray.500">
          Loading Dashboard...
        </Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8} id="home-page-content">
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Box>
          <Heading as="h2" size="2xl" color="gray.800" letterSpacing="tight">
            Dashboard
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Overview for the selected period
          </Text>
        </Box>

        <HStack gap={3} w={{ base: "full", md: "auto" }}>
          {/* --- PERIOD SELECTOR --- */}
          <Box w="200px">
            <NativeSelect.Root size="sm" variant="subtle">
              <NativeSelect.Field
                value={currentResetId || ""}
                onChange={handleResetChange}
                bg="white"
                borderColor="gray.300"
                shadow="sm"
                fontWeight="medium"
                cursor="pointer"
              >
                {resets.map((r) => (
                  <option key={r.id} value={r.id}>
                    {/* Updated to use 'reset_date' */}
                    {new Date(r.reset_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>

          <Button
            onClick={() => {
              if (
                window.confirm(
                  "Start a fresh period? This will archive the current view.",
                )
              ) {
                performReset();
              }
            }}
            variant="ghost"
            color="gray.500"
            _hover={{ bg: "red.50", color: "red.600" }}
            size="sm"
          >
            New Period
          </Button>

          <Button
            onClick={handleAdd}
            bg="blue.600"
            color="white"
            variant="solid"
            shadow="md"
            _hover={{
              bg: "blue.700",
              shadow: "lg",
              transform: "translateY(-1px)",
            }}
          >
            + Add
          </Button>
        </HStack>
      </Flex>

      <TotalsSection />

      <Box mt={8}>
        <TransactionTable onEdit={handleEdit} onDelete={handleDelete} />
      </Box>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={transactionToEdit}
      />
    </Container>
  );
};

export default Home;
