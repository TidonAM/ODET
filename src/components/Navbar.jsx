import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Flex, Spacer } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "bg-blue-700" : "");

  return (
    // <nav className="bg-blue-600 text-white p-4 shadow-md">
    //   <Flex>
    //     <h1 className="text-xl font-bold">Expense Tracker</h1>
    //     <div className="flex space-x-4">
    //       <Link
    //         to="/"
    //         className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive("/")}`}
    //       >
    //         Dashboard
    //       </Link>
    //       <Link
    //         to="/settings"
    //         className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive(
    //           "/settings"
    //         )}`}
    //       >
    //         Settings
    //       </Link>
    //     </div>
    //   </Flex>
    // </nav>
    <nav>
      <Stack></Stack>
    </nav>
  );
};

export default Navbar;
