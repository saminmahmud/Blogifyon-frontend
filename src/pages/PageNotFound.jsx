import React from "react";
import { useNavigate } from 'react-router';  

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen text-white ">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red-600">404</h1>
        <p className="text-2xl font-semibold">Oops! Page not found.</p>
        <p className="mt-4 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-block px-6 py-3 text-xl bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go back to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
