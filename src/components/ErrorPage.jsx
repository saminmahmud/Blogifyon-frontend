import React from "react";
import { useNavigate } from "react-router";


const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red-600">500</h1>
        <p className="text-2xl font-semibold">Oops! Something went wrong.</p>
        <p className="mt-4 text-lg">
          There was an error processing your request. Please try again later.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-block px-6 py-3 text-xl bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
