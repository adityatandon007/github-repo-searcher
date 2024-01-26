import React from 'react';
import { Repository } from '../features/githubSlice'; // Import Repository interface

interface CardProps {
  repository: Repository | null;
}

const Card: React.FC<CardProps> = ({ repository }) => {
  if (!repository) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">{repository.name}</h2>
      <p className="text-gray-600">{repository.description}</p>
      <a
        href={repository.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline block mt-2"
      >
        Repository Link
      </a>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">
        Deploy
      </button>
    </div>
  );
};

export default Card;
