import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth.api';
import { storage } from '../../utils/storage';

export const loginThunk = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data);
    storage.setToken(res.data.token);
    storage.setUser(res.data.user);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const registerThunk = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.register(data);
    storage.setToken(res.data.token);
    storage.setUser(res.data.user);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMeThunk = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.me();
    storage.setUser(res.data.user);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState = {
  user: storage.getUser(),
  token: storage.getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      storage.clear();
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setSuccess = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token || state.token;
    };
    const setFailed = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(loginThunk.pending, setLoading)
      .addCase(loginThunk.fulfilled, setSuccess)
      .addCase(loginThunk.rejected, setFailed)
      .addCase(registerThunk.pending, setLoading)
      .addCase(registerThunk.fulfilled, setSuccess)
      .addCase(registerThunk.rejected, setFailed)
      .addCase(fetchMeThunk.fulfilled, (state, action) => { state.user = action.payload.user; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
