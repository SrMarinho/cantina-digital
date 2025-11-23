import { apiClient } from './api/apiClient';
import { LoginRequest, LoginResponse, User, ApiResponse } from './api/types';

export class AuthService {
  private basePath = '/auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.basePath}/login`, credentials);
    
    // Salvar token no localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  async register(userData: any): Promise<User> {
    return apiClient.post<User>(`${this.basePath}/register`, userData);
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