// src/contexts/DataContext.jsx
import { createContext, useContext } from "react";

// 1. Create the Context Instance here
export const DataContext = createContext();

// 2. Export the Hook here
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
