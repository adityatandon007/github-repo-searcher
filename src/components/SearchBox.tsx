import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom debounce function using useCallback
  const debouncedFetch = useCallback(
    debounce((query: string, page: number) => {
      // @ts-ignore
      dispatch(fetchRepositories(query, page));
    }, 500),
    [dispatch]
  );

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
    // Close the dropdown after selecting a repository
    setDropdownOpen(false);
  };

  const handleWindowClick = (e: MouseEvent) => {
    // Check if the click is outside the input and dropdown
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      // Close the dropdown
      setDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    // Toggle the dropdown visibility
    setDropdownOpen((prev) => !prev);
  };


  useEffect(() => {
    // Add a click event listener on window
    window.addEventListener('click', handleWindowClick);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []); 

  return (
    <div className="max-w-md mx-auto mt-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search repositories"
        className="w-full p-2 border rounded"
        ref={inputRef}
        onFocus={toggleDropdown}
      />
      {isDropdownOpen && (
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
        {loading && <p className="mt-2 text-center">Loading...</p>}
      </div>
      )}
    </div>
  );
};

export default SearchBox;

// Debounce function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
