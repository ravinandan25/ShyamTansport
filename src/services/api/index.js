import axios from 'axios';
import {BASE_URL} from '../../utils/constants';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let sessionToken = null;
let onSessionExpired = () => {};

// Called by AuthProvider so every request carries the signed-in session.
export const setSessionToken = token => {
  sessionToken = token;
};

export const setOnSessionExpired = handler => {
  onSessionExpired = handler;
};

axiosInstance.interceptors.request.use(config => {
  if (sessionToken) {
    config.headers.Authorization = `Token ${sessionToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 401 = session ended on the server (signed out, revoked or account deactivated).
    if (error?.response?.status === 401 && sessionToken) {
      onSessionExpired();
    }
    return Promise.reject(error);
  },
);
