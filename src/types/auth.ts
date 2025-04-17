export interface User {
  email: string;
  password: string; // Note: In real backend integration, never store plain text passwords
  createdAt: string;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
} 