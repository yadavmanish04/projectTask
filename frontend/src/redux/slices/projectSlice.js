import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectApi } from '../../api/project.api';

export const fetchProjects = createAsyncThunk('projects/list', async (params) => {
  const res = await projectApi.list(params);
  return res.data.projects;
});

export const fetchProject = createAsyncThunk('projects/get', async (id) => {
  const res = await projectApi.get(id);
  return res.data.project;
});

export const createProject = createAsyncThunk('projects/create', async (data) => {
  const res = await projectApi.create(data);
  return res.data.project;
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }) => {
  const res = await projectApi.update(id, data);
  return res.data.project;
});

export const deleteProject = createAsyncThunk('projects/delete', async (id) => {
  await projectApi.remove(id);
  return id;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { items: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProjects.pending, (s) => { s.loading = true; });
    b.addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; });
    b.addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(fetchProject.fulfilled, (s, a) => { s.current = a.payload; });
    b.addCase(createProject.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateProject.fulfilled, (s, a) => {
      s.items = s.items.map((p) => (p._id === a.payload._id ? a.payload : p));
      if (s.current?._id === a.payload._id) s.current = a.payload;
    });
    b.addCase(deleteProject.fulfilled, (s, a) => {
      s.items = s.items.filter((p) => p._id !== a.payload);
    });
  },
});

export default projectSlice.reducer;
