/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Optional: Add request interceptor for auth tokens
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Function to perform logout
        const logout = () => {
            isRefreshing = false;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        };

        // Handle 401 errors
        if (error.response?.status === 401) {
            // If it's an auth endpoint (except refresh itself), don't try to refresh
            const isAuthEndpoint = [
                ENDPOINTS.AUTH.LOGIN,
                ENDPOINTS.AUTH.REGISTER,
                ENDPOINTS.AUTH.VERIFY_OTP,
                ENDPOINTS.AUTH.GOOGLE
            ].includes(originalRequest.url);

            if (isAuthEndpoint) {
                return Promise.reject(error);
            }

            // If it's the refresh token endpoint that failed with 401, logout immediately
            if (originalRequest.url === ENDPOINTS.AUTH.REFRESH) {
                logout();
                return Promise.reject(error);
            }

            // If we've already tried to retry, don't try again
            if (originalRequest._retry) {
                logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            try {
                const rs = await axios.post(`${api.defaults.baseURL}${ENDPOINTS.AUTH.REFRESH}`, {
                    refresh_token: refreshToken
                });

                const { access_token, refresh_token } = rs.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                processQueue(null, access_token);

                return api(originalRequest);
            } catch (_error) {
                processQueue(_error, null);
                logout();
                return Promise.reject(_error);
            } finally {
                isRefreshing = false;
            }
        }

        // Also handle "User not found" errors which might return 404
        if (error.response?.status === 404 && error.response?.data?.detail === "User not found") {
            logout();
        }

        return Promise.reject(error);
    }
);

export default api;
