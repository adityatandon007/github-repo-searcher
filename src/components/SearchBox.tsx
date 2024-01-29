import React, { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { setSearchQuery, fetchRepositories, setSelectedRepository, setDropdownOpen, Repository } from '../features/githubSlice';

const SearchBox: React.FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state: RootState) => state.github.searchQuery);
  const loading = useSelector((state: RootState) => state.github.loading);
  const repositories = useSelector((state: RootState) => state.github.repositories);
  const selectedRepository = useSelector((state: RootState) => state.github.selectedRepository);
  const isDropdownOpen = useSelector((state: RootState) => state.github.isDropdownOpen);

  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
    dispatch(setSearchQuery(selectedRepo.name));
    dispatch(setDropdownOpen(false));
  };

  const handleWindowClick = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      dispatch(setDropdownOpen(false));
    }
  };

  const openDropdown = () => {
    dispatch(setDropdownOpen(true));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDropdownOpen && repositories.length > 0) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prevIndex) => (prevIndex !== null ? Math.max(prevIndex - 1, 0) : repositories.length - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prevIndex) => (prevIndex !== null ? Math.min(prevIndex + 1, repositories.length - 1) : 0));
          break;
        case 'Enter':
          if (focusedIndex !== null) {
            handleRepositorySelect(repositories[focusedIndex]);
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []); 

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search repositories"
          className="w-full p-3 border rounded-t focus:outline-none focus:ring focus:border-blue-300 transition-all duration-300"
          ref={inputRef}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
        />
        {isDropdownOpen ? (
          <div
            ref={dropdownRef}
            onScroll={handleDropdownScroll}
            className="max-h-40 overflow-y-auto border rounded-b absolute w-full bg-white shadow-md z-10"
          >
            {repositories.length ? repositories.map((repo: Repository, index: number) => (
              <div
                key={repo.id}
                onClick={() => handleRepositorySelect(repo)}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  selectedRepository?.id === repo.id ? 'bg-blue-200' : ''
                } transition-all duration-300 ${index === focusedIndex ? 'bg-gray-200' : ''}`}
              >
                {repo.name}
              </div>
            )): <div>No results found</div>}
            {loading && page > 1 && <div className="p-2 text-center">Loading...</div>}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBox;

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
