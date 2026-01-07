import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useData } from "../contexts/DataContext";
import { formatDateForInput } from "../lib/helpers";

const AddTransactionModal = ({ isOpen, onClose }) => {
	const { categories, accounts, addTransaction } = useData();
	const { register, handleSubmit, reset, setFocus } = useForm({
		defaultValues: { date: formatDateForInput(), service_fee: 0 },
	});

	useEffect(() => {
		if (isOpen) {
			reset({ date: formatDateForInput(), service_fee: 0 });
			// Small timeout to ensure DOM is ready before focusing
			setTimeout(() => setFocus("date"), 100);
		}
	}, [isOpen, reset, setFocus]);

	const onSubmit = async (data) => {
		// Convert empty strings to null for optional IDs
		const formattedData = {
			...data,
			negative_account_id: data.negative_account_id || null,
			positive_account_id: data.positive_account_id || null,
			category_id: data.category_id || null,
		};

		const success = await addTransaction(formattedData);
		if (success) onClose();
	};

	// "Enter goes to next field" logic
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && e.target.type !== "submit") {
			e.preventDefault();
			const form = e.target.form;
			const index = Array.prototype.indexOf.call(form, e.target);
			// Try to find the next focusable element
			let nextElement = form.elements[index + 1];
			while (nextElement && nextElement.disabled) {
				nextElement =
					form.elements[Array.prototype.indexOf.call(form, nextElement) + 1];
			}
			if (nextElement) nextElement.focus();
		}
	};

	if (!isOpen) return null;

	const inputClasses =
		"mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border";

	return (
		<div
			className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
			id="my-modal"
		>
			<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-medium text-gray-900">Add Transaction</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-500"
					>
						<IoMdClose size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
					<div className="space-y-4">
						{/* Date */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Date
							</label>
							<input
								type="date"
								{...register("date", { required: true })}
								className={inputClasses}
							/>
						</div>

						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Category
							</label>
							<select {...register("category_id")} className={inputClasses}>
								<option value="">Select Category</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.title}
									</option>
								))}
							</select>
						</div>

						{/* Negative To */}
						<div>
							<label className="block text-sm font-medium text-gray-700 text-red-600">
								Negative To (From)
							</label>
							<select
								{...register("negative_account_id")}
								className={inputClasses}
							>
								<option value="">Select Account</option>
								{accounts.map((acc) => (
									<option key={acc.id} value={acc.id}>
										{acc.title}
									</option>
								))}
							</select>
						</div>

						{/* Positive To */}
						<div>
							<label className="block text-sm font-medium text-gray-700 text-green-600">
								Positive To (To)
							</label>
							<select
								{...register("positive_account_id")}
								className={inputClasses}
							>
								<option value="">Select Account</option>
								{accounts.map((acc) => (
									<option key={acc.id} value={acc.id}>
										{acc.title}
									</option>
								))}
							</select>
						</div>

						{/* Price & Fee Row */}
						<div className="flex space-x-2">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700">
									Price
								</label>
								<input
									type="number"
									step="0.01"
									{...register("price", { required: true })}
									className={inputClasses}
								/>
							</div>
							<div className="w-1/3">
								<label className="block text-sm font-medium text-gray-700">
									S. Fee
								</label>
								<input
									type="number"
									step="0.01"
									{...register("service_fee")}
									className={inputClasses}
								/>
							</div>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<input
								type="text"
								{...register("description")}
								className={inputClasses}
							/>
						</div>

						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
						>
							Add Transaction
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddTransactionModal;
