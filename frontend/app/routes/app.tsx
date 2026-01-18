import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/login");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div>
      <h1>App Dashboard</h1>
      <p>Welcome, {session.user.email}!</p>
      <p>This is your main app page. Implement your app features here.</p>
      <button onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}
