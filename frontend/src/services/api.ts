import axios from 'axios';
import {
  AuthResponse,
  DashboardStats,
  AdminStats,
  InterviewSession,
  Question,
  Role,
  User,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    targetRole?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  updateProfile: async (data: { name: string; targetRole: string }): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<string> => {
    const response = await api.put<string>('/auth/password', data);
    return response.data;
  },
};

// Roles Service
export const rolesApi = {
  getAll: async (activeOnly = true): Promise<Role[]> => {
    const response = await api.get<Role[]>(`/roles?activeOnly=${activeOnly}`);
    return response.data;
  },
  getById: async (id: number): Promise<Role> => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },
};

// Questions Service
export const questionsApi = {
  getAll: async (): Promise<Question[]> => {
    const response = await api.get<Question[]>('/questions');
    return response.data;
  },
  getByRole: async (roleId: number): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/questions/role/${roleId}`);
    return response.data;
  },
  getById: async (id: number): Promise<Question> => {
    const response = await api.get<Question>(`/questions/${id}`);
    return response.data;
  },
};

// Interviews Service
export const interviewApi = {
  start: async (config: {
    roleId: number;
    difficulty?: string;
    totalQuestions: number;
  }): Promise<InterviewSession> => {
    const response = await api.post<InterviewSession>('/interviews/start', config);
    return response.data;
  },
  getById: async (id: number): Promise<InterviewSession> => {
    const response = await api.get<InterviewSession>(`/interviews/${id}`);
    return response.data;
  },
  submitAnswer: async (
    sessionId: number,
    data: { questionId: number; answer: string; timeTakenSeconds: number }
  ): Promise<InterviewSession> => {
    const response = await api.post<InterviewSession>(`/interviews/${sessionId}/answer`, data);
    return response.data;
  },
  finish: async (sessionId: number): Promise<InterviewSession> => {
    const response = await api.post<InterviewSession>(`/interviews/${sessionId}/finish`);
    return response.data;
  },
  getHistory: async (): Promise<InterviewSession[]> => {
    const response = await api.get<InterviewSession[]>('/interviews/history');
    return response.data;
  },
  getReport: async (sessionId: number): Promise<InterviewSession> => {
    const response = await api.get<InterviewSession>(`/interviews/${sessionId}/report`);
    return response.data;
  },
  deleteSession: async (sessionId: number): Promise<void> => {
    await api.delete(`/interviews/${sessionId}`);
  },
};

// Dashboard Service
export const dashboardApi = {
  getStudentStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/student');
    return response.data;
  },
};

// Admin Service
export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },
  getQuestions: async (): Promise<Question[]> => {
    const response = await api.get<Question[]>('/admin/questions');
    return response.data;
  },
  createQuestion: async (question: Partial<Question>): Promise<Question> => {
    const response = await api.post<Question>('/admin/questions', question);
    return response.data;
  },
  updateQuestion: async (id: number, question: Partial<Question>): Promise<Question> => {
    const response = await api.put<Question>(`/admin/questions/${id}`, question);
    return response.data;
  },
  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/admin/questions/${id}`);
  },
  toggleQuestion: async (id: number): Promise<Question> => {
    const response = await api.patch<Question>(`/admin/questions/${id}/toggle`);
    return response.data;
  },
  createRole: async (role: Partial<Role>): Promise<Role> => {
    const response = await api.post<Role>('/admin/roles', role);
    return response.data;
  },
  updateRole: async (id: number, role: Partial<Role>): Promise<Role> => {
    const response = await api.put<Role>(`/admin/roles/${id}`, role);
    return response.data;
  },
  deleteRole: async (id: number): Promise<void> => {
    await api.delete(`/admin/roles/${id}`);
  },
  getAllInterviews: async (): Promise<InterviewSession[]> => {
    const response = await api.get<InterviewSession[]>('/admin/interviews');
    return response.data;
  },
};

export default api;
