import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, AuthProviderProps } from '../lib/types';
import { TEACHERS, ADMIN } from '../lib/data';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('exam_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check Admin
    if (username === ADMIN.username && password === 'admin123') {
      setUser(ADMIN);
      localStorage.setItem('exam_user', JSON.stringify(ADMIN));
      toast.success(`Welcome, Admin ${ADMIN.name}`);
      return true;
    }

    // Check Teachers
    const foundTeacher = TEACHERS.find(t => t.username === username);
    if (foundTeacher && password === 'password123') {
      setUser(foundTeacher);
      localStorage.setItem('exam_user', JSON.stringify(foundTeacher));
      toast.success(`Welcome back, ${foundTeacher.name}`);
      return true;
    }
    
    toast.error('Invalid username or password');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('exam_user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};