import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { setSearchQuery, fetchRepositories } from '../features/githubSlice';

const SearchBox: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.github.searchQuery);
  const loading = useSelector((state: RootState) => state.github.loading);
  const repositories = useSelector((state: RootState) => state.github.repositories);

  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      // @ts-ignore
      dispatch(fetchRepositories(searchQuery, page));
    }
  }, [searchQuery, page, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
    setPage(1);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search repositories"
        className="w-full p-2 border rounded"
      />
      {loading && <p className="mt-2">Loading...</p>}
      <div
        ref={dropdownRef}
        className="mt-2 max-h-40 overflow-y-auto border rounded"
      >
        {repositories.map((repo) => (
          <div key={repo.id} className="p-2 cursor-pointer hover:bg-gray-200">
            {repo.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
