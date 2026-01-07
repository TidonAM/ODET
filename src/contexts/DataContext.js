import { createContext, useContext } from "react";

// We create the context here
export const DataContext = createContext(undefined);

/**
 * Custom hook to use the Budget Data
 * Adding JSDoc like this fixes the "any" warning in VS Code!
 * @returns {{
 * loading: boolean,
 * transactions: Array,
 * categories: Array,
 * accounts: Array,
 * accountTotals: Object,
 * addTransaction: Function,
 * performReset: Function,
 * addCategory: Function,
 * addAccount: Function
 * }}
 */
export const useData = () => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
