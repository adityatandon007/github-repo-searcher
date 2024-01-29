import React from 'react';
import { Repository } from '../features/githubSlice';

interface CardProps {
  repository: Repository | null;
  isDropdownOpen: boolean;
}

const Card: React.FC<CardProps> = ({ repository, isDropdownOpen }) => {
  if (!repository || isDropdownOpen) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded-md shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white">
      <h2 className="text-3xl font-extrabold">{repository.name}</h2>
      <p className="text-gray-200 mt-2">{repository.description}</p>
      <a
        href={repository.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-300 hover:underline block mt-4"
      >
        Repository Link
      </a>
      <button className="bg-pink-500 text-white px-6 py-2 rounded-full mt-4 hover:bg-pink-600 transition-all duration-300 ease-in-out">
        Deploy Now!
      </button>
    </div>
  );
};

export default Card;
