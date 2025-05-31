import { apiService } from './api';
import { AuthenticationRequest, AuthenticationResponse, RegisterRequest } from '~/types/auth';

export class AuthService {
  async login(credentials: AuthenticationRequest): Promise<AuthenticationResponse> {
    const response = await apiService.post<AuthenticationResponse>('/auth/login', credentials);
    apiService.setAuthToken(response.token);
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthenticationResponse> {
    const response = await apiService.post<AuthenticationResponse>('/auth/register', userData);
    apiService.setAuthToken(response.token);
    return response;
  }

  async toggleRole(email: string, adminSecret: string): Promise<AuthenticationResponse> {
    return apiService.post<AuthenticationResponse>(
      '/auth/toggle-role',
      { email },
      { headers: { 'Admin-Secret': adminSecret } }
    );
  }

  logout(): void {
    apiService.removeAuthToken();
  }
}

export const authService = new AuthService();