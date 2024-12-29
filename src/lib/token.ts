// lib/token.ts
// Token key for storage
const TOKEN_KEY = 'authToken';

// Save token securely
export const saveToken = (token: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  localStorage.setItem(TOKEN_KEY, token);
};

// Retrieve token
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY) || null;

// Remove token
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
