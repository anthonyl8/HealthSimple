import { useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import { useRequireAuth } from "~/hooks/useRequireAuth";

export default function App() {
  const navigate = useNavigate();
  const { session, loading } = useRequireAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  const handleMainPage = async () => {
    navigate("/mainPage");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-teal-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <p className="text-2xl text-teal-700 mb-8 text-center font-light">
          Welcome, {session.user.email}!
        </p>
        <div className="space-y-4">
          <button
            onClick={handleMainPage}
            className="w-full px-6 py-3 bg-teal-700 text-white rounded-full font-medium hover:bg-teal-800 transition-colors shadow-md"
          >
            Main Page
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-white text-teal-700 border-2 border-teal-700 rounded-full font-medium hover:bg-teal-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}