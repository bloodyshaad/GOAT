export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface StoredUser extends User {
  password: string;
}