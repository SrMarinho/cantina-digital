import { apiClient } from './apiClient';
import type { AxiosResponse } from 'axios';
import type { User } from '../types/user.type';


interface LoginResponse extends AxiosResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface UserRegisterResponse {
  userId: string
  message: string
}

interface RegisterResponse extends AxiosResponse {
  user: UserRegisterResponse
  token: string
}

export class AuthService {
  private basePath = '/auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.basePath}/login`, {
      email: credentials.email,
      senha: credentials.password,
    });

    // Salvar token no localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<User>(`${this.basePath}/register`, {
      nome: userData.name,
      email: userData.email,
      senha: userData.password,
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    // Opcional: chamar endpoint de logout no backend
    // await apiClient.post(`${this.basePath}/logout`);
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/me`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();