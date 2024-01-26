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
    <div>
      <h2>{repository.name}</h2>
      <p>{repository.description}</p>
      <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
        Repository Link
      </a>
      <button>Deploy</button>
    </div>
  );
};

export default Card;
