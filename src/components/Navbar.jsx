import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
	const location = useLocation();
	const isActive = (path) => (location.pathname === path ? "bg-blue-700" : "");

	return (
		<nav className="bg-blue-600 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-xl font-bold">Budget Tracker</h1>
				<div className="flex space-x-4">
					<Link
						to="/"
						className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive("/")}`}
					>
						Dashboard
					</Link>
					<Link
						to="/settings"
						className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive(
							"/settings"
						)}`}
					>
						Settings
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
