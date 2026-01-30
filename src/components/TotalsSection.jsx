import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Flex,
  Heading,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { useData } from "../contexts/DataContext";
import { formatCurrency } from "../lib/helpers";

// --- NEW COMPONENT: Account Chip ---
const AccountChip = ({ account, total }) => {
  // Logic for Credit Cards:
  // If it's a credit card, the "Total" is how much you OWE.
  // We can show the "Minimum Due" as a small helper text.
  const isCredit = account.is_credit;
  const minDue = isCredit ? total * (account.min_payment_percent / 100) : 0;

  return (
    <Box
      bg="gray.800" // Dark background like your image
      color="white"
      borderRadius="2xl"
      py={4}
      px={5}
      shadow="md"
      position="relative"
      overflow="hidden"
      borderWidth="1px"
      borderColor="gray.700"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
    >
      {/* Decorative Glow based on account color */}
      <Box
        position="absolute"
        top="-50%"
        right="-20%"
        w="100px"
        h="100px"
        bg={account.color}
        opacity="0.2"
        filter="blur(40px)"
        borderRadius="full"
      />

      <Stack gap={0}>
        {/* 1. Account Name (Small Text) */}
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
          color={account.color} // Use the user-defined color for the label
        >
          {account.title}
        </Text>

        {/* 2. Price Total (Big Text) */}
        <Text fontSize="2xl" fontWeight="bold" mt={1}>
          {formatCurrency(total)}
        </Text>

        {/* 3. Extra Details for Credit Cards */}
        {isCredit && (
          <Flex align="center" gap={2} mt={2}>
            <Badge size="xs" colorPalette="red" variant="solid">
              DUE: {account.due_date}
            </Badge>
            {total > 0 && (
              <Text fontSize="xs" color="gray.400">
                Min: {formatCurrency(minDue)}
              </Text>
            )}
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

const TotalsSection = () => {
  const { accounts, accountTotals } = useData();

  // 1. Separate Cash vs. Credit Accounts
  const cashAccounts = accounts.filter((acc) => !acc.is_credit);
  const creditAccounts = accounts.filter((acc) => acc.is_credit);

  // 2. Calculate Aggregates
  const cashTotal = cashAccounts.reduce(
    (sum, acc) => sum + (accountTotals[acc.id] || 0),
    0,
  );
  const debtTotal = creditAccounts.reduce(
    (sum, acc) => sum + (accountTotals[acc.id] || 0),
    0,
  );
  const netPosition = cashTotal - debtTotal;

  return (
    <Stack gap={8} mb={8}>
      {/* --- TOP: NET WORTH SUMMARY --- */}
      {/* (Kept this as a "Hero" card because it's the most important number) */}
      <Box
        bgGradient="to-r"
        gradientFrom="blue.900"
        gradientTo="gray.900"
        borderRadius="2xl"
        p={6}
        shadow="lg"
        color="white"
      >
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={8}
          textAlign={{ base: "left", md: "center" }}
        >
          <Box>
            <Text
              fontSize="xs"
              color="gray.400"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Total Cash
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.300">
              {formatCurrency(cashTotal)}
            </Text>
          </Box>
          <Box borderLeftWidth={{ md: "1px" }} borderLeftColor="whiteAlpha.200">
            <Text
              fontSize="xs"
              color="gray.400"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Total Debt
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.300">
              {formatCurrency(debtTotal)}
            </Text>
          </Box>
          <Box borderLeftWidth={{ md: "1px" }} borderLeftColor="whiteAlpha.200">
            <Text
              fontSize="xs"
              color="gray.400"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Net Position
            </Text>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={netPosition >= 0 ? "blue.300" : "orange.300"}
            >
              {formatCurrency(netPosition)}
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      <Flex>
        {/* --- ASSETS (CASH) CHIPS --- */}
        <Box>
          <Heading
            size="sm"
            color="gray.500"
            mb={4}
            textTransform="uppercase"
            fontSize="xs"
            letterSpacing="widest"
          >
            Cash & Assets
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4}>
            {accounts.map((acc) => (
              <AccountChip
                key={acc.id}
                account={acc}
                total={accountTotals[acc.id] || 0}
              />
            ))}
            {accounts.length === 0 && (
              <Text fontSize="sm" color="gray.400">
                No cash accounts.
              </Text>
            )}
          </SimpleGrid>
        </Box>
      </Flex>
    </Stack>
  );
};

export default TotalsSection;
