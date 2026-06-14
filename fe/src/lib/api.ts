import { useAuthStore } from '@/store/useAuthStore';

type FetchOptions = RequestInit & {
  requireAuth?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/api"}`;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const fetchApi = async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
  const { requireAuth = true, ...customOptions } = options;
  const headers = new Headers(customOptions.headers);

  if (!headers.has('Content-Type') && !(customOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Đảm bảo gửi kèm httpOnly cookie
  customOptions.credentials = 'include';

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...customOptions,
    headers,
  });

  if (response.status === 401 && requireAuth && !endpoint.includes('/auth/refresh')) {
    if (isRefreshing) {
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        headers.set('Authorization', `Bearer ${token}`);
        return await fetch(`${BASE_URL}${endpoint}`, {
          ...customOptions,
          headers,
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        const { token } = await refreshRes.json();
        // Cập nhật lại token mới vào store (giữ nguyên thông tin user)
        useAuthStore.getState().login(useAuthStore.getState().user!, token);
        
        processQueue(null, token);
        
        headers.set('Authorization', `Bearer ${token}`);
        response = await fetch(`${BASE_URL}${endpoint}`, {
          ...customOptions,
          headers,
        });
      } else {
        processQueue(new Error('Refresh failed'));
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    } catch (refreshErr) {
      processQueue(refreshErr);
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};
