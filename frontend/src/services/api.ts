import axios from 'axios';
import type { Book, Member, BorrowRecord } from '../types';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear expired token
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Books API
export const bookAPI = {
  getAll: () => api.get<Book[]>('/book'),
  getById: (id: number) => api.get<Book>(`/book/${id}`),
  getByIsbn: (isbn: string) => api.get<Book>(`/book/${isbn}`),
  searchByTitle: (title: string) => api.get<Book>(`/book/search/${title}`),
  create: (book: Omit<Book, 'id'>) => api.post<Book>('/book', book),
  update: (title: string, book: Partial<Book>) => api.put<Book>(`/book/edit/${title}`, book),
  delete: (id: number) => api.delete(`/book/delete/${id}`),
};

// Members API
export const memberAPI = {
  getAll: () => api.get<Member[]>('/member'),
  getById: (id: number) => api.get<Member>(`/member/${id}`),
  create: (member: Omit<Member, 'id'>) => api.post<Member>('/member/add', member),
  update: (id: number, member: Partial<Member>) => api.put<Member>(`/member/${id}`, member),
  delete: (id: number) => api.delete(`/member/${id}`),
};

// Borrow Records API
export const borrowAPI = {
  getAll: () => api.get<BorrowRecord[]>('/issuebook'),
  getById: (id: number) => api.get<BorrowRecord>(`/issuebook/${id}`),
  create: (borrow: { memberId: number; bookId: number }) => 
    api.post<BorrowRecord>('/issuebook', {
      memberId: borrow.memberId,
      bookId: borrow.bookId
    }),
  returnBook: (id: number) => api.post<BorrowRecord>(`/issuebook/return/${id}`),
  getActive: () => api.get<BorrowRecord[]>(`/issuebook/active`),
}; 