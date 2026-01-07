import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContextCreate";

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async (userId) => {
		const { data, error } = await supabase
			.from("profiles")
			.select(`username, website, avatar_url`)
			.eq("id", userId)
			.single();

		if (!error && data) setProfile(data);
	};

	useEffect(() => {
		// 1. Check current session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			if (session) fetchProfile(session.user.id);
			setLoading(false);
		});

		// 2. Listen for auth changes (login/logout)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (session) fetchProfile(session.user.id);
			else setProfile(null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = () => supabase.auth.signOut();

	return (
		<AuthContext.Provider
			value={{ session, profile, loading, signOut, setProfile }}
		>
			{children}
		</AuthContext.Provider>
	);
};
