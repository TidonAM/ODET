import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, Button, Link, Badge } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
// You can use standard icons or react-icons
import {
  IoLogOutOutline,
  IoSettingsOutline,
  IoGridOutline,
} from "react-icons/io5";

const Navbar = () => {
  const { signOut, session } = useAuth();
  const location = useLocation();

  // Helper to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      as="nav"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      px={4}
      py={3}
      position="sticky"
      top={0}
      zIndex={10}
      shadow="sm"
    >
      <Flex alignItems="center" justify="space-between" maxW="1200px" mx="auto">
        {/* --- BRANDING --- */}
        <HStack gap={3}>
          <Box
            bgGradient="to-r"
            gradientFrom="blue.600"
            gradientTo="blue.400"
            w={8}
            h={8}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justify="center"
          >
            <Text color="white" fontWeight="bold" fontSize="sm">
              OD
            </Text>
          </Box>
          <Box display={{ base: "none", md: "block" }}>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color="gray.800"
              lineHeight={1}
            >
              Angel's ODET
            </Text>
            <Text fontSize="xs" color="gray.500">
              Online Dashboard for Expense Tracking
            </Text>
          </Box>
        </HStack>

        {/* --- NAVIGATION LINKS --- */}
        <HStack gap={{ base: 2, md: 6 }}>
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <Flex
              align="center"
              gap={2}
              px={3}
              py={2}
              borderRadius="md"
              bg={isActive("/") ? "blue.50" : "transparent"}
              color={isActive("/") ? "blue.600" : "gray.600"}
              fontWeight={isActive("/") ? "bold" : "medium"}
              transition="all 0.2s"
              _hover={{ bg: "gray.50", color: "blue.600" }}
            >
              <IoGridOutline size={18} />
              <Text display={{ base: "none", sm: "block" }}>Dashboard</Text>
            </Flex>
          </Link>

          <Link
            as={RouterLink}
            to="/settings"
            _hover={{ textDecoration: "none" }}
          >
            <Flex
              align="center"
              gap={2}
              px={3}
              py={2}
              borderRadius="md"
              bg={isActive("/settings") ? "blue.50" : "transparent"}
              color={isActive("/settings") ? "blue.600" : "gray.600"}
              fontWeight={isActive("/settings") ? "bold" : "medium"}
              transition="all 0.2s"
              _hover={{ bg: "gray.50", color: "blue.600" }}
            >
              <IoSettingsOutline size={18} />
              <Text display={{ base: "none", sm: "block" }}>Settings</Text>
            </Flex>
          </Link>
        </HStack>

        {/* --- USER ACTIONS --- */}
        <HStack gap={3}>
          {/* Optional: Show User Initials or Avatar */}
          <Box
            display={{ base: "none", md: "flex" }}
            bg="gray.100"
            color="gray.600"
            w={8}
            h={8}
            borderRadius="full"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
          >
            {session?.user?.email?.charAt(0).toUpperCase() || "U"}
          </Box>

          <Button
            size="sm"
            variant="ghost"
            colorPalette="red"
            color="red.600"
            _hover={{ bg: "red.50" }}
            onClick={signOut}
          >
            <IoLogOutOutline size={20} />
            <Text display={{ base: "none", md: "block" }} ml={2}>
              Sign Out
            </Text>
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
