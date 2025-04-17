import { User } from '../types/auth';

const STORAGE_KEYS = {
  USERS: 'ai_summarizer_users',
  CURRENT_USER: 'ai_summarizer_current_user'
} as const;

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const checkUserExists = (email: string): boolean => {
  const users = getUsers();
  return users.some(user => user.email === email);
}; 