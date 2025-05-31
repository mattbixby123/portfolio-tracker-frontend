import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Investment Portfolio Tracker" },
    { name: "description", content: "Track your investment portfolio with ease!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="m-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Investment Portfolio Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage your investments and track performance in real-time
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}