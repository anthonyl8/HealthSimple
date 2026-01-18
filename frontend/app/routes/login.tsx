import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    // Check if we have token_hash in URL (magic link callback)
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const hasTokenHash = !!token_hash;

    if (hasTokenHash) {
      setVerifying(true);
      // Verify the OTP token
      supabase.auth.verifyOtp({
        token_hash,
        type: "email" as const,
      }).then(({ error }) => {
        if (error) {
          setAuthError(error.message);
        } else {
          setAuthSuccess(true);
          // Clear URL params
          window.history.replaceState({}, document.title, "/login");
        }
        setVerifying(false);
      });
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Redirect to app if already logged in
        navigate("/app");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/app");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      }
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess(true);
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  // Show verification state
  if (verifying) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>Confirming your magic link...</p>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth success
  if (authSuccess && !session) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>✓ Check your email for the login link!</p>
        <p>Click the link in your email to complete login.</p>
      </div>
    );
  }

  // Show login form
  return (
    <div>
      <h1>Sign In</h1>
      <p>Sign in via magic link with your email below</p>
      {authError && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <p>✗ {authError}</p>
        </div>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? <span>Loading</span> : <span>Send magic link</span>}
        </button>
      </form>
    </div>
  );
}
