import React from "react";
import { useData } from "../contexts/DataContext";
import { formatCurrency } from "../lib/helpers";

const TotalsSection = () => {
	const { accounts, accountTotals } = useData();

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
			{accounts.map((acc) => {
				const total = accountTotals[acc.id] || 0;
				return (
					<div
						key={acc.id}
						className="bg-white p-4 rounded-lg shadow-sm border-l-4"
						style={{ borderLeftColor: acc.color }}
					>
						<h3 className="text-sm text-gray-500 font-medium">{acc.title}</h3>
						<p
							className={`text-xl font-bold ${
								total < 0 ? "text-red-600" : "text-gray-800"
							}`}
						>
							{formatCurrency(total)}
						</p>
					</div>
				);
			})}
		</div>
	);
};

export default TotalsSection;
