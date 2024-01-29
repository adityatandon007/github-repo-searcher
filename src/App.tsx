import React from 'react';
import SearchBox from './components/SearchBox';
import Card from './components/Card';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';

const App: React.FC = () => {
  const selectedRepository = useSelector((state: RootState) => state.github.selectedRepository);
  const isDropdownOpen = useSelector((state: RootState) => state.github.isDropdownOpen);
  return (
    <div className="app-container h-screen bg-gradient-to-b from-indigo-500 to-teal-500">
      <div className="font-bold text-2xl text-center pt-8 mb-8 text-white">Github Searcher</div>
      <SearchBox />
      <Card repository={selectedRepository} isDropdownOpen={isDropdownOpen} />
    </div>
  );
};

export default App;
