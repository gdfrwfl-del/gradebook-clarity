import { ReactNode } from 'react';

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Subject {
  id: string;
  name: string;
  maxScore: number;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  grade: Grade;
  avatar?: string;
  role: 'teacher';
  subjectIds: string[];
}

export interface Admin {
  id: string;
  name: string;
  username: string;
  role: 'admin';
  avatar?: string;
}

export type User = Teacher | Admin;

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: Grade;
}

export interface ExamRecord {
  id: string;
  studentId: string;
  scores: Record<string, number>; // subjectId -> score
  comments: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}