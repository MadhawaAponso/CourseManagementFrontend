export type Role = 'student' | 'instructor' | 'admin';

export interface UserRequestDTO {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}
