export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  space_name: string;
  space_address: string;
  utility_unit_number: string;
}

export interface LoginResponse {
  access_token: string;
  uid: string;
  role: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  space_id?: string;
  token_type?: string;
}

export interface User {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  space_id?: string;
  space_name?: string;
  space_address?: string;
  utility_unit_number?: string;
}
