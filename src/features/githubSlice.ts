import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../app/store';

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
}

interface GitHubState {
  searchQuery: string;
  repositories: Repository[];
  loading: boolean;
  selectedRepository: Repository | null;
}

const initialState: GitHubState = {
  searchQuery: '',
  repositories: [],
  loading: false,
  selectedRepository: null,
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setRepositories: (state, action: PayloadAction<Repository[]>) => {
      state.repositories = state.repositories.length > 0 ? [...state.repositories, ...action.payload] : action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSelectedRepository: (state, action: PayloadAction<Repository | null>) => {
      state.selectedRepository = action.payload;
    },
  },
});

export const { setSearchQuery, setRepositories, setLoading, setSelectedRepository } = githubSlice.actions;

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
  } finally {
    dispatch(setLoading(false));
  }
};
