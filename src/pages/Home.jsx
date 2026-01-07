import React, { useState } from "react";
import TotalsSection from "../components/TotalsSection";
import TransactionTable from "../components/TransactionTable";
import AddTransactionModal from "../components/AddTransactionModal";
import { useData } from "../contexts/DataContext";

const Home = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { performReset, loading } = useData();

	if (loading && !isModalOpen)
		return <div className="container mx-auto p-6">Loading data...</div>;

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
				<div className="space-x-2">
					<button
						onClick={performReset}
						className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition"
					>
						Reset View
					</button>
					<button
						onClick={() => setIsModalOpen(true)}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow"
					>
						+ Add Transaction
					</button>
				</div>
			</div>

			<TotalsSection />
			<TransactionTable />

			<AddTransactionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default Home;
