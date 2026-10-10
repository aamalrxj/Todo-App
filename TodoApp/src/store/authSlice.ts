import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User } from '../types';
import * as authApi from '../api/authApi';
import { setAuthToken, getErrorMessage } from '../api/client';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface Credentials {
  email: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;       // true while login/register is in progress
  initializing: boolean;  // true while we check for a saved session at startup
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  initializing: true,
  error: null,
};

// Saves the session on the device so the user stays logged in after restart
const persistSession = async (data: AuthResponse) => {
  await AsyncStorage.setItem(TOKEN_KEY, data.token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  setAuthToken(data.token);
};

export const register = createAsyncThunk<AuthResponse, Credentials, { rejectValue: string }>(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.register(email, password);
      await persistSession(data);
      return data;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const login = createAsyncThunk<AuthResponse, Credentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(email, password);
      await persistSession(data);
      return data;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

// Runs once at app start: loads a saved session if there is one
export const restoreSession = createAsyncThunk<AuthResponse | null>(
  'auth/restore',
  async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const user = await AsyncStorage.getItem(USER_KEY);
    if (!token || !user) return null;
    setAuthToken(token);
    return { token, user: JSON.parse(user) as User };
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
  setAuthToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.initializing = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      .addCase(restoreSession.rejected, state => {
        state.initializing = false;
      })
      .addCase(logout.fulfilled, state => {
        state.token = null;
        state.user = null;
      })
      // login and register behave the same way, so they share handlers
      .addMatcher(isAnyOf(login.pending, register.pending), state => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(login.fulfilled, register.fulfilled), (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addMatcher(isAnyOf(login.rejected, register.rejected), (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Something went wrong';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;