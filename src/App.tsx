import React from 'react';
import SearchBox from './components/SearchBox';
import Card from './components/Card';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';

const App: React.FC = () => {
  const selectedRepository = useSelector((state: RootState) => state.github.selectedRepository);
  return (
    <div>
      <SearchBox />
      <Card repository={selectedRepository} />
    </div>
  );
};

export default App;

