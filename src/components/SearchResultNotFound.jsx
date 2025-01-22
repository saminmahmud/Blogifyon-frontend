import React from 'react';
import { useNavigate } from 'react-router';

const SearchResultNotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-600">No Results Found</h1>
        <p className="text-2xl font-semibold mt-4">We couldn't find any results for your search.</p>
        <p className="mt-4 text-lg">Try searching with different keywords or check the spelling.</p>
        <button
            onClick={() => navigate(-1)}
          className="mt-6 inline-block px-6 py-3 text-xl bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go back to search
        </button>
      </div>
    </div>
  );
};

export default SearchResultNotFound;
