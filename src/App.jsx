import React from "react";
import { Provider } from "./components/ui/provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth"; // Ensure this path is correct
import { Flex, Spacer } from "@chakra-ui/react";
import { Stack, Box } from "@chakra-ui/react";

// This internal component handles the "Logged In vs Logged Out" view
const MainLayout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Provider>
        <Flex>
          <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-xl font-semibold text-blue-600 animate-pulse">
              Loading Angel's UDIT...
            </div>
          </div>
        </Flex>
      </Provider>
    );
  }

  return (
    <Provider>
      <Stack>
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
    </Provider>
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
