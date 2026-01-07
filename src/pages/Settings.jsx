import React, { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

// --- Sub-component for Adding Categories/Accounts ---
const SettingsForm = ({ type, onSubmit }) => {
	const [title, setTitle] = useState("");
	const [color, setColor] = useState(
		type === "category" ? "#3b82f6" : "#10b981"
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (title) {
			onSubmit(title, color);
			setTitle("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-end space-x-2 mb-4">
			<div className="flex-1">
				<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
					Title
				</label>
				<input
					className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder={`New ${type}...`}
					required
				/>
			</div>
			<div>
				<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
					Color
				</label>
				<input
					type="color"
					className="h-10 p-1 border rounded w-14 cursor-pointer"
					value={color}
					onChange={(e) => setColor(e.target.value)}
				/>
			</div>
			<button
				type="submit"
				className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-10 transition shadow-sm"
			>
				Add
			</button>
		</form>
	);
};

const Settings = () => {
	const { categories, accounts, addCategory, addAccount } = useData();
	const { session, signOut } = useAuth(); // Use your Auth context

	// Profile State
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState("");
	const [website, setWebsite] = useState("");

	// Load Profile Data
	useEffect(() => {
		let ignore = false;
		async function getProfile() {
			if (!session?.user) return;
			setLoading(true);
			const { data, error } = await supabase
				.from("profiles")
				.select(`username, website`)
				.eq("id", session.user.id)
				.single();

			if (!ignore) {
				if (error) console.warn(error);
				else if (data) {
					setUsername(data.username || "");
					setWebsite(data.website || "");
				}
			}
			setLoading(false);
		}

		getProfile();
		return () => {
			ignore = true;
		};
	}, [session]);

	// Update Profile Logic
	async function updateProfile(e) {
		e.preventDefault();
		setLoading(true);
		const updates = {
			id: session.user.id,
			username,
			website,
			updated_at: new Date(),
		};

		const { error } = await supabase.from("profiles").upsert(updates);
		if (error) alert(error.message);
		else alert("Profile updated successfully!");
		setLoading(false);
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">System Settings</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* --- 1. USER PROFILE SECTION --- */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h2 className="text-xl font-bold mb-6 flex items-center">
						<span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 text-sm">
							👤
						</span>
						User Profile
					</h2>
					<form onSubmit={updateProfile} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
								Email
							</label>
							<input
								className="w-full border p-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
								type="text"
								value={session?.user?.email}
								disabled
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
								Display Name
							</label>
							<input
								className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
								Website
							</label>
							<input
								className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
								type="url"
								value={website}
								onChange={(e) => setWebsite(e.target.value)}
							/>
						</div>
						<div className="pt-4 space-y-2">
							<button
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
								type="submit"
								disabled={loading}
							>
								{loading ? "Saving..." : "Update Profile"}
							</button>
							<button
								onClick={signOut}
								className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg transition"
								type="button"
							>
								Sign Out
							</button>
						</div>
					</form>
				</div>

				{/* --- 2. CATEGORIES SECTION --- */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h2 className="text-xl font-bold mb-6 flex items-center">
						<span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 text-sm">
							🏷️
						</span>
						Categories
					</h2>
					<SettingsForm type="category" onSubmit={addCategory} />
					<div className="max-h-64 overflow-y-auto space-y-2 pr-2">
						{categories.map((cat) => (
							<div
								key={cat.id}
								className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
							>
								<div className="flex items-center space-x-3">
									<div
										className="w-4 h-4 rounded-full shadow-inner"
										style={{ backgroundColor: cat.color }}
									></div>
									<span className="font-medium text-gray-700">{cat.title}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* --- 3. ACCOUNTS SECTION --- */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h2 className="text-xl font-bold mb-6 flex items-center">
						<span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3 text-sm">
							💳
						</span>
						Accounts
					</h2>
					<SettingsForm type="account" onSubmit={addAccount} />
					<div className="max-h-64 overflow-y-auto space-y-2 pr-2">
						{accounts.map((acc) => (
							<div
								key={acc.id}
								className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
							>
								<div className="flex items-center space-x-3">
									<div
										className="w-4 h-4 rounded-full shadow-inner"
										style={{ backgroundColor: acc.color }}
									></div>
									<span className="font-medium text-gray-700">{acc.title}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
