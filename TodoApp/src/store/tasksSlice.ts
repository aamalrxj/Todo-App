import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Task, NewTask } from '../types';
import * as taskApi from '../api/taskApi';
import { getErrorMessage } from '../api/client';
import { logout } from './authSlice';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = { items: [], loading: false, error: null };

type ThunkConfig = { rejectValue: string };

export const fetchTasks = createAsyncThunk<Task[], void, ThunkConfig>(
  'tasks/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await taskApi.getTasks();
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const addTask = createAsyncThunk<Task, NewTask, ThunkConfig>(
  'tasks/add',
  async (task, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(task);
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

// Flips the completed flag of a task
export const toggleTask = createAsyncThunk<Task, Task, ThunkConfig>(
  'tasks/toggle',
  async (task, { rejectWithValue }) => {
    try {
      return await taskApi.updateTask(task._id, { completed: !task.completed });
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const removeTask = createAsyncThunk<string, string, ThunkConfig>(
  'tasks/remove',
  async (id, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(id);
      return id; // return the id so the reducer knows what to remove
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load tasks';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const i = state.items.findIndex(t => t._id === action.payload._id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      // Clear tasks on logout so the next user never sees them
      .addCase(logout.fulfilled, () => initialState);
  },
});

export default tasksSlice.reducer;