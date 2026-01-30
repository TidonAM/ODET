import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth"; // Ensure this path is correct
import { Flex, Spinner, Center, Stack, Text } from "@chakra-ui/react";

// This internal component handles the "Logged In vs Logged Out" view
const MainLayout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh" bg="gray.100">
        <Flex direction="column" align="center" gap={4}>
          <Spinner size="xl" color="blue.600" />
          <Text
            fontSize="xl"
            fontWeight="semibold"
            color="blue.600"
            animation="pulse"
          >
            Loading Angel's ODET...
          </Text>
        </Flex>
      </Center>
    );
  }

  return (
    <Stack minH="100vh">
      {!session ? (
        <Auth />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </>
      )}
    </Stack>
  );
};

// The default export MUST be the main component
export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <MainLayout />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
