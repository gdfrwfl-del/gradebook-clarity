import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Teacher, Subject, Student } from '../lib/types';
import { TEACHERS, SUBJECTS, INITIAL_STUDENTS } from '../lib/data';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  LogOut, 
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ManageTeachers from './admin/ManageTeachers';
import ManageSubjects from './admin/ManageSubjects';
import ManageLearners from './admin/ManageLearners';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects' | 'learners'>('teachers');

  // Local state to simulate database persistence within admin session
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('admin_teachers');
    return saved ? JSON.parse(saved) : TEACHERS;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('admin_subjects');
    return saved ? JSON.parse(saved) : SUBJECTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('admin_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem('admin_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('admin_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('admin_students', JSON.stringify(students));
  }, [students]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center p-1 shadow-lg">
               <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">ExamPro</h1>
              <p className="text-xs text-slate-400">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'teachers' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            Teachers
          </button>
          <button 
            onClick={() => setActiveTab('subjects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'subjects' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen size={20} />
            Subjects
          </button>
          <button 
            onClick={() => setActiveTab('learners')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'learners' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <GraduationCap size={20} />
            Learners
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl mb-4">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-700" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Portal Control</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {activeTab === 'teachers' && 'Teacher Management'}
              {activeTab === 'subjects' && 'Subject Configuration'}
              {activeTab === 'learners' && 'Learner Grade Management'}
            </h2>
          </div>
          
          <div className="hidden md:block">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/adde22be-3f86-44f5-bd78-4113e176c3ce/admin-header-f2b66df0-1778177662597.webp" 
              alt="Admin Banner"
              className="h-12 w-48 object-cover rounded-lg shadow-sm"
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'teachers' && (
                <ManageTeachers teachers={teachers} setTeachers={setTeachers} subjects={subjects} />
              )}
              {activeTab === 'subjects' && (
                <ManageSubjects subjects={subjects} setSubjects={setSubjects} />
              )}
              {activeTab === 'learners' && (
                <ManageLearners students={students} setStudents={setStudents} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;