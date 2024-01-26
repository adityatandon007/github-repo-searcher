import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { setSearchQuery, fetchRepositories, setSelectedRepository, Repository } from '../features/githubSlice';

const SearchBox: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.github.searchQuery);
  const loading = useSelector((state: RootState) => state.github.loading);
  const repositories = useSelector((state: RootState) => state.github.repositories);
  const selectedRepository = useSelector((state: RootState) => state.github.selectedRepository);

  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced fetch function
  const debouncedFetch = debounce((query: string, page: number) => {
    // @ts-ignore
    dispatch(fetchRepositories(query, page));
  }, 500);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      debouncedFetch(searchQuery, page);
    }
  }, [searchQuery, page, debouncedFetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
    setPage(1);
  };

  const handleDropdownScroll = () => {
    if (dropdownRef.current) {
      const isScrolledToBottom =
        dropdownRef.current.scrollHeight - dropdownRef.current.scrollTop === dropdownRef.current.clientHeight;

      if (isScrolledToBottom && repositories.length >= 8) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleRepositorySelect = (selectedRepo: Repository) => {
    dispatch(setSelectedRepository(selectedRepo));
  };

  return (
    <div className="max-w-md mx-auto mt-4">
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
        onScroll={handleDropdownScroll}
        className="mt-2 max-h-40 overflow-y-auto border rounded"
      >
        {repositories.map((repo) => (
          <div
            key={repo.id}
            onClick={() => handleRepositorySelect(repo)}
            className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedRepository?.id === repo.id ? 'bg-blue-200' : ''}`}
          >
            {repo.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
