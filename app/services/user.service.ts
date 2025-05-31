import { apiService } from './api';
import { UserDto } from '~/types/user';

export class UserService {
  async getUserProfile(): Promise<UserDto> {
    return apiService.get<UserDto>('/users/profile');
  }

  async updateUserProfile(user: Partial<UserDto>): Promise<UserDto> {
    return apiService.put<UserDto>('/users/profile', user);
  }

  async changePassword(newPassword: string): Promise<void> {
    return apiService.post<void>('/users/change-password', { newPassword });
  }

  // Admin endpoints
  async getAllUsers(): Promise<UserDto[]> {
    return apiService.get<UserDto[]>('/users/admin/all');
  }

  async adminUpdateUser(id: number, user: Partial<UserDto>): Promise<UserDto> {
    return apiService.put<UserDto>(`/users/admin/${id}`, user);
  }

  async toggleUserEnabled(id: number): Promise<void> {
    return apiService.post<void>(`/users/admin/${id}/toggle-enabled`);
  }

  async deleteUser(id: number): Promise<void> {
    return apiService.delete<void>(`/users/admin/${id}`);
  }
}

export const userService = new UserService();