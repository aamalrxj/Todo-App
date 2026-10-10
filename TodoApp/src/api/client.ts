import axios from 'axios';

// 10.0.2.2 is how the Android emulator reaches your computer's localhost
export const API_URL = 'http://10.0.2.2:5000/api';

const client = axios.create({ baseURL: API_URL, timeout: 10000 });

// Attach (or remove) the JWT on every request
export const setAuthToken = (token: string | null): void => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
};

// Turns any error into a readable message for the UI
export const getErrorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    return e.response?.data?.message ?? e.message;
  }
  return 'Something went wrong';
};

export default client;