import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-teal-700 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl w-full">
        <h1 className="text-6xl font-light text-white mb-4 tracking-wide">
          Welcome to HealthSimple
        </h1>
        <p className="text-xl text-teal-100 mb-12">
          Your wellness monitoring solution
        </p>
        <div>
          <Link to="/login">
            <button className="px-12 py-3 bg-white text-teal-700 rounded-full font-medium hover:bg-teal-50 transition-colors shadow-lg text-lg">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}