export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  nombre: string;
  email: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}