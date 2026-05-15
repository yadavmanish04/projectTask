import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from '../../api/task.api';

export const fetchTasks = createAsyncThunk('tasks/list', async (params) => {
  const res = await taskApi.list(params);
  return res.data.tasks;
});

export const createTask = createAsyncThunk('tasks/create', async (data) => {
  const res = await taskApi.create(data);
  return res.data.task;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }) => {
  const res = await taskApi.update(id, data);
  return res.data.task;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await taskApi.remove(id);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    upsertTask: (state, action) => {
      const idx = state.items.findIndex((t) => t._id === action.payload._id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeTaskLocal: (state, action) => {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchTasks.pending, (s) => { s.loading = true; });
    b.addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(createTask.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateTask.fulfilled, (s, a) => {
      s.items = s.items.map((t) => (t._id === a.payload._id ? a.payload : t));
    });
    b.addCase(deleteTask.fulfilled, (s, a) => {
      s.items = s.items.filter((t) => t._id !== a.payload);
    });
  },
});

export const { upsertTask, removeTaskLocal } = taskSlice.actions;
export default taskSlice.reducer;
