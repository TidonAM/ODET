import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContextCreate";

// Ensure the hook is exported here
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Extract profile directly from the Auth Session (No DB Call)
  const extractProfileFromSession = (session) => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    // Grab data from the "User Metadata" JSON blob instead of a separate table
    const meta = session.user.user_metadata || {};

    setProfile({
      id: session.user.id,
      username:
        meta.username || meta.full_name || session.user.email.split("@")[0],
      website: meta.website || "",
      avatar_url: meta.avatar_url || "",
    });
  };

  useEffect(() => {
    // 1. Initial Load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      extractProfileFromSession(session); // <--- Instant, no 404
      setLoading(false);
    });

    // 2. Listen for Login/Logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      extractProfileFromSession(session); // <--- Instant, no 404
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
