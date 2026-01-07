import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { DataContext } from "./DataContext";
import { useAuth } from "./AuthContext";

export const DataProvider = ({ children }) => {
	const { session } = useAuth();
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const [categories, setCategories] = useState([]);
	const [accounts, setAccounts] = useState([]);
	const [currentResetId, setCurrentResetId] = useState(null);
	const [accountTotals, setAccountTotals] = useState({});

	// --- 1. CORE FETCHING LOGIC ---

	const fetchTransactions = useCallback(async (resetId) => {
		setLoading(true);
		const { data, error } = await supabase
			.from("transactions")
			.select(
				`
        *,
        categories (title, color),
        neg_acc:negative_account_id (title, color),
        pos_acc:positive_account_id (title, color)
      `
			)
			.eq("reset_id", resetId)
			.order("date", { ascending: false })
			.order("created_at", { ascending: false });

		if (!error && data) setTransactions(data);
		setLoading(false);
	}, []);

	const fetchMetaData = useCallback(async () => {
		if (!session) return;
		setLoading(true);
		try {
			const [catRes, accRes, resetRes] = await Promise.all([
				supabase.from("categories").select("*").order("title"),
				supabase.from("accounts").select("*").order("title"),
				supabase
					.from("resets")
					.select("*")
					.order("reset_date", { ascending: false })
					.limit(1),
			]);

			if (catRes.data) setCategories(catRes.data);
			if (accRes.data) setAccounts(accRes.data);

			if (resetRes.data && resetRes.data.length > 0) {
				setCurrentResetId(resetRes.data[0].id);
			}
		} catch (error) {
			console.error("UDIT Fetch Error:", error);
		} finally {
			setLoading(false);
		}
	}, [session]);

	// --- 2. THE MATH (The "UDIT" Process) ---

	const calculateTotals = useCallback(() => {
		const totals = {};
		// Initialize all accounts to ₱0.00
		accounts.forEach((acc) => {
			totals[acc.id] = 0;
		});

		transactions.forEach((tx) => {
			const price = Number(tx.price) || 0;
			const fee = Number(tx.service_fee) || 0;

			// 1. Handle Positive Account (Add)
			if (
				tx.positive_account_id &&
				Object.hasOwn(totals, tx.positive_account_id)
			) {
				totals[tx.positive_account_id] += price;
			}

			// 2. Handle Negative Account (Subtract price + fee)
			if (
				tx.positive_account_id &&
				Object.hasOwn(totals, tx.negative_account_id)
			) {
				totals[tx.negative_account_id] -= price + fee;
			}
		});
		setAccountTotals(totals);
	}, [transactions, accounts]);

	// --- 3. AUTO-RUN EFFECTS ---

	useEffect(() => {
		if (!session) {
			setLoading(false); // Stop the spinner if there's no user
			return;
		}
		fetchMetaData();
	}, [session, fetchMetaData]);

	useEffect(() => {
		let isSubscribed = true;

		if (isSubscribed) {
			fetchMetaData();
		}

		return () => {
			isSubscribed = false;
		};
	}, [fetchMetaData]);

	useEffect(() => {
		if (currentResetId) {
			fetchTransactions(currentResetId);
		}
	}, [currentResetId, fetchTransactions]);

	useEffect(() => {
		calculateTotals();
	}, [calculateTotals]);

	// --- 4. EXPORTED ACTIONS ---

	const addTransaction = async (newTx) => {
		if (!currentResetId || !session) {
			alert("No active Reset ID found. Please create a reset in the database.");
			return false;
		}

		const { data, error } = await supabase
			.from("transactions")
			.insert([
				{ ...newTx, reset_id: currentResetId, user_id: session.user.id },
			])
			.select();

		if (!error && data) {
			await fetchTransactions(currentResetId);
			return true;
		}
		console.error("Supabase Error:", error);
		return false;
	};

	const performReset = async () => {
		const confirmMsg =
			"Ready for a new UDIT? This will archive current transactions and clear your dashboard.";
		if (!window.confirm(confirmMsg)) return;

		const { data, error } = await supabase
			.from("resets")
			.insert([{ user_id: session.user.id }]) // Link reset to user
			.select();

		if (!error && data?.[0]) {
			setCurrentResetId(data[0].id);
		}
	};

	const addCategory = async (title, color) => {
		const { error } = await supabase
			.from("categories")
			.insert([{ title, color }]);
		if (!error) fetchMetaData();
	};

	const addAccount = async (title, color) => {
		const { error } = await supabase
			.from("accounts")
			.insert([{ title, color }]);
		if (!error) fetchMetaData();
	};

	const value = {
		loading,
		transactions,
		categories,
		accounts,
		accountTotals,
		addTransaction,
		performReset,
		addCategory,
		addAccount,
	};

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
