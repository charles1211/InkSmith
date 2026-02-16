import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for an existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('inksmith_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // SIMULATED API CALL
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock Admin Logic
        if (email.toLowerCase().includes('admin')) {
          const adminUser: User = { id: 'admin-1', name: 'Studio Admin', email, role: 'admin' };
          setUser(adminUser);
          localStorage.setItem('inksmith_user', JSON.stringify(adminUser));
          resolve();
        } 
        // Mock Client Logic
        else if (password.length >= 6) {
          const clientUser: User = { id: 'client-1', name: email.split('@')[0], email, role: 'client' };
          setUser(clientUser);
          localStorage.setItem('inksmith_user', JSON.stringify(clientUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
        setIsLoading(false);
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // SIMULATED API CALL
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = { id: Math.random().toString(36).substr(2, 9), name, email, role: 'client' };
        setUser(newUser);
        localStorage.setItem('inksmith_user', JSON.stringify(newUser));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inksmith_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
