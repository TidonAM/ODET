// src/contexts/DataProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { DataContext } from "./DataContext"; // <--- IMPORT FROM STEP 1

// We export ONLY the component here to satisfy Fast Refresh
export const DataProvider = ({ children }) => {
  const { session } = useAuth();

  const [resets, setResets] = useState([]);
  const [currentResetId, setCurrentResetId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountTotals, setAccountTotals] = useState({});
  const [loading, setLoading] = useState(true);

  // --- FETCH METADATA ---
  const fetchMetaData = useCallback(async () => {
    try {
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .order("title");
      if (catData) setCategories(catData);

      const { data: accData } = await supabase
        .from("accounts")
        .select("*")
        .order("title");
      if (accData) setAccounts(accData);

      const { data: resetData, error } = await supabase
        .from("resets")
        .select("*")
        .order("reset_date", { ascending: false });

      if (error) throw error;
      setResets(resetData || []);

      if (resetData && resetData.length > 0 && !currentResetId) {
        setCurrentResetId(resetData[0].id);
      }
    } catch (error) {
      console.error("Error loading metadata:", error.message);
    }
  }, [currentResetId]);

  // --- FETCH TRANSACTIONS ---
  const fetchTransactions = useCallback(async (resetId) => {
    if (!resetId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        categories (id, title, color),
        neg_acc:negative_account_id (id, title, color, is_credit),
        pos_acc:positive_account_id (id, title, color, is_credit)
      `,
      )
      .eq("reset_id", resetId)
      .order("date", { ascending: false });

    if (error) console.error("Error fetching transactions:", error.message);
    else setTransactions(data || []);
    setLoading(false);
  }, []);

  // --- CALCULATE TOTALS ---
  const calculateTotals = useCallback(() => {
    const totals = {};
    accounts.forEach((acc) => {
      totals[acc.id] = 0;
    });
    transactions.forEach((tx) => {
      const price = Number(tx.price) || 0;
      const fee = Number(tx.service_fee) || 0;
      if (
        tx.negative_account_id &&
        Object.hasOwn(totals, tx.negative_account_id)
      ) {
        const acc = accounts.find((a) => a.id === tx.negative_account_id);
        if (acc?.is_credit) totals[tx.negative_account_id] += price + fee;
        else totals[tx.negative_account_id] -= price + fee;
      }
      if (
        tx.positive_account_id &&
        Object.hasOwn(totals, tx.positive_account_id)
      ) {
        const acc = accounts.find((a) => a.id === tx.positive_account_id);
        if (acc?.is_credit) totals[tx.positive_account_id] -= price;
        else totals[tx.positive_account_id] += price;
      }
    });
    setAccountTotals(totals);
  }, [transactions, accounts]);

  // --- CRUD OPERATIONS ---
  const addCategory = async (data) => {
    await supabase.from("categories").insert([data]);
    await fetchMetaData();
  };
  const addAccount = async (data) => {
    await supabase.from("accounts").insert([data]);
    await fetchMetaData();
  };
  const editCategory = async (id, data) => {
    await supabase.from("categories").update(data).eq("id", id);
    await fetchMetaData();
  };
  const editAccount = async (id, data) => {
    await supabase.from("accounts").update(data).eq("id", id);
    await fetchMetaData();
  };
  const deleteCategory = async (id) => {
    await supabase.from("categories").delete().eq("id", id);
    await fetchMetaData();
  };
  const deleteAccount = async (id) => {
    await supabase.from("accounts").delete().eq("id", id);
    await fetchMetaData();
  };

  const addTransaction = async (txData) => {
    if (!currentResetId) return false;
    const { error } = await supabase
      .from("transactions")
      .insert([{ ...txData, reset_id: currentResetId }]);
    if (error) {
      alert(error.message);
      return false;
    }
    await fetchTransactions(currentResetId);
    return true;
  };
  const editTransaction = async (id, data) => {
    const { error } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", id);
    if (error) {
      alert(error.message);
      return false;
    }
    await fetchTransactions(currentResetId);
    return true;
  };
  const deleteTransaction = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return false;
    }
    await fetchTransactions(currentResetId);
    return true;
  };

  const performReset = async () => {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("resets")
      .insert([
        { reset_date: new Date().toISOString(), user_id: session.user.id },
      ])
      .select()
      .single();
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    await fetchMetaData();
    setCurrentResetId(data.id);
    setLoading(false);
  };

  const switchReset = (id) => setCurrentResetId(id);

  // --- EFFECTS ---
  useEffect(() => {
    if (session) fetchMetaData();
  }, [session, fetchMetaData]);
  useEffect(() => {
    if (currentResetId) fetchTransactions(currentResetId);
  }, [currentResetId, fetchTransactions]);
  useEffect(() => {
    calculateTotals();
  }, [transactions, accounts, calculateTotals]);

  // Use the Provider from the imported context
  return (
    <DataContext.Provider
      value={{
        resets,
        currentResetId,
        switchReset,
        performReset,
        categories,
        accounts,
        transactions,
        accountTotals,
        loading,
        addCategory,
        editCategory,
        deleteCategory,
        addAccount,
        editAccount,
        deleteAccount,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
