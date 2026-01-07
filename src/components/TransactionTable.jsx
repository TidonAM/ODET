import React from "react";
import { useData } from "../contexts/DataContext";
import { formatCurrency } from "../lib/helpers";

const TransactionTable = () => {
	const { transactions, loading } = useData();

	if (loading) return <div className="p-4">Loading...</div>;

	return (
		<div className="bg-white shadow rounded-lg overflow-hidden">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							Date
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							Category
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							From (Neg)
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							To (Pos)
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							Desc
						</th>
						<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
							Price (Fee)
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{transactions.map((tx) => (
						<tr key={tx.id} className="hover:bg-gray-50">
							<td className="px-4 py-3 whitespace-nowrap text-sm">{tx.date}</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm">
								<span
									className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
									style={{
										backgroundColor: tx.categories?.color + "40",
										color: tx.categories?.color,
									}}
								>
									{tx.categories?.title}
								</span>
							</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">
								{tx.neg_acc?.title}
							</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
								{tx.pos_acc?.title}
							</td>
							<td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">
								{tx.description}
							</td>
							<td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
								{formatCurrency(tx.price)}
								{tx.service_fee > 0 && (
									<span className="text-xs text-gray-400 block">
										{" "}
										+ {formatCurrency(tx.service_fee)} fee
									</span>
								)}
							</td>
						</tr>
					))}
					{transactions.length === 0 && (
						<tr>
							<td colSpan="6" className="text-center py-4 text-gray-500">
								No transactions in this period.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default TransactionTable;
