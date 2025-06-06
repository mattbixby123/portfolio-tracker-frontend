export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  enabled: boolean;
}