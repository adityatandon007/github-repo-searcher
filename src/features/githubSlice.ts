import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../app/store';

interface GitHubState {
  searchQuery: string;
  repositories: any[];
  loading: boolean;
}

const initialState: GitHubState = {
  searchQuery: '',
  repositories: [],
  loading: false,
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setRepositories: (state, action: PayloadAction<any[]>) => {
      state.repositories = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setRepositories, setLoading } = githubSlice.actions;

export default githubSlice.reducer;

// Async thunk for fetching repositories
export const fetchRepositories = (query: string, page: number): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&page=${page}&per_page=8`);
    const data = await response.json();
    dispatch(setRepositories(data.items));
  } catch (error) {
    console.error('Error fetching repositories:', error);
  }
};
