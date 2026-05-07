import { Teacher, Student, Subject, ExamRecord, Admin } from './types';

export const ADMIN: Admin = {
  id: 'admin-1',
  name: 'System Administrator',
  username: 'admin',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin1',
};

export const TEACHERS: Teacher[] = Array.from({ length: 9 }, (_, i) => ({
  id: `t-${i + 1}`,
  name: `Teacher Grade ${i + 1}`,
  username: `teacher${i + 1}`,
  grade: (i + 1) as any,
  role: 'teacher',
  subjectIds: ['math', 'eng', 'sci', 'soc'],
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=teacher${i + 1}`,
}));

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', maxScore: 100 },
  { id: 'eng', name: 'English Language', maxScore: 100 },
  { id: 'sci', name: 'Science', maxScore: 100 },
  { id: 'soc', name: 'Social Studies', maxScore: 100 },
  { id: 'art', name: 'Fine Arts', maxScore: 100 },
  { id: 'pe', name: 'Physical Education', maxScore: 100 },
];

export const INITIAL_STUDENTS: Student[] = Array.from({ length: 27 }, (_, i) => {
  const grade = (Math.floor(i / 3) + 1) as any;
  const studentIndex = (i % 3) + 1;
  return {
    id: `s-${i + 1}`,
    name: `Student ${studentIndex} (Grade ${grade})`,
    rollNumber: `G${grade}-00${studentIndex}`,
    grade,
  };
});

export const INITIAL_RECORDS: ExamRecord[] = INITIAL_STUDENTS.map(s => ({
  id: `r-${s.id}`,
  studentId: s.id,
  scores: {
    math: Math.floor(Math.random() * 40) + 60,
    eng: Math.floor(Math.random() * 40) + 60,
    sci: Math.floor(Math.random() * 40) + 60,
    soc: Math.floor(Math.random() * 40) + 60,
    art: Math.floor(Math.random() * 40) + 60,
    pe: Math.floor(Math.random() * 40) + 60,
  },
  comments: 'Performing well in all subjects. Needs to focus more on handwriting.',
  updatedAt: new Date().toISOString(),
}));