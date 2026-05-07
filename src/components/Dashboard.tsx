import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Student, ExamRecord, Teacher } from '../lib/types';
import { SUBJECTS, INITIAL_STUDENTS, INITIAL_RECORDS } from '../lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  FileText, 
  LogOut, 
  Plus, 
  Search, 
  ClipboardCheck,
  UserCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const teacher = user as Teacher;
  const [view, setView] = useState<'students' | 'records'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // New Student Form State
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '' });

  useEffect(() => {
    if (teacher) {
      // Prioritize admin-modified data if it exists, otherwise use initial/localStorage
      const adminStudentsRaw = localStorage.getItem('admin_students');
      const adminStudents: Student[] = adminStudentsRaw ? JSON.parse(adminStudentsRaw) : [];
      
      const storedStudents = localStorage.getItem(`students_grade_${teacher.grade}`);
      const storedRecords = localStorage.getItem(`records_grade_${teacher.grade}`);
      
      if (adminStudents.length > 0) {
        const filtered = adminStudents.filter(s => s.grade === teacher.grade);
        setStudents(filtered);
      } else if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      } else {
        const filtered = INITIAL_STUDENTS.filter(s => s.grade === teacher.grade);
        setStudents(filtered);
        localStorage.setItem(`students_grade_${teacher.grade}`, JSON.stringify(filtered));
      }

      if (storedRecords) {
        setRecords(JSON.parse(storedRecords));
      } else {
        const filtered = INITIAL_RECORDS.filter(r => 
          INITIAL_STUDENTS.find(s => s.id === r.studentId && s.grade === teacher.grade)
        );
        setRecords(filtered);
        localStorage.setItem(`records_grade_${teacher.grade}`, JSON.stringify(filtered));
      }
    }
  }, [teacher]);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem(`students_grade_${teacher?.grade}`, JSON.stringify(newStudents));
    
    // Also update admin global list to stay in sync
    const adminStudentsRaw = localStorage.getItem('admin_students');
    if (adminStudentsRaw) {
       const allStudents: Student[] = JSON.parse(adminStudentsRaw);
       const updated = allStudents.map(s => {
         const match = newStudents.find(ns => ns.id === s.id);
         return match ? match : s;
       });
       // Add new students that aren't in admin list yet
       const justAdded = newStudents.filter(ns => !allStudents.find(s => s.id === ns.id));
       localStorage.setItem('admin_students', JSON.stringify([...updated, ...justAdded]));
    }
  };

  const saveRecords = (newRecords: ExamRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(`records_grade_${teacher?.grade}`, JSON.stringify(newRecords));
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rollNumber) {
      toast.error('Please fill all fields');
      return;
    }
    const student: Student = {
      id: `s-${Date.now()}`,
      name: newStudent.name,
      rollNumber: newStudent.rollNumber,
      grade: teacher!.grade,
    };
    saveStudents([...students, student]);
    
    // Initialize record for new student
    const record: ExamRecord = {
      id: `r-${student.id}`,
      studentId: student.id,
      scores: SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub.id]: 0 }), {}),
      comments: '',
      updatedAt: new Date().toISOString(),
    };
    saveRecords([...records, record]);

    setNewStudent({ name: '', rollNumber: '' });
    setIsAddStudentOpen(false);
    toast.success('Student added successfully');
  };

  const handleUpdateScore = (studentId: string, subjectId: string, value: string) => {
    const score = parseInt(value) || 0;
    const clampedScore = Math.min(100, Math.max(0, score));
    
    const updatedRecords = records.map(r => {
      if (r.studentId === studentId) {
        return {
          ...r,
          scores: { ...r.scores, [subjectId]: clampedScore },
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    saveRecords(updatedRecords);
  };

  const handleUpdateComment = (studentId: string, comment: string) => {
    const updatedRecords = records.map(r => {
      if (r.studentId === studentId) {
        return { ...r, comments: comment, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    saveRecords(updatedRecords);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentScore = (studentId: string, subjectId: string): number => {
    const record = records.find(r => r.studentId === studentId);
    return record?.scores[subjectId] || 0;
  };

  const getStudentComment = (studentId: string) => {
    return records.find(r => r.studentId === studentId)?.comments || '';
  };

  const calculateAverage = (studentId: string): string => {
    const record = records.find(r => r.studentId === studentId);
    if (!record) return "0.0";
    const values = Object.values(record.scores) as number[];
    if (values.length === 0) return "0.0";
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
  };

  const getGradeLetter = (avgStr: string) => {
    const avg = parseFloat(avgStr);
    if (avg >= 90) return 'A+';
    if (avg >= 80) return 'A';
    if (avg >= 70) return 'B';
    if (avg >= 60) return 'C';
    if (avg >= 50) return 'D';
    return 'F';
  };

  if (!teacher) return null;

  // Use teacher's assigned subjects if available
  const teacherSubjects = teacher.subjectIds && teacher.subjectIds.length > 0 
    ? SUBJECTS.filter(s => teacher.subjectIds.includes(s.id)) 
    : SUBJECTS;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm border border-slate-100 overflow-hidden">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/adde22be-3f86-44f5-bd78-4113e176c3ce/school-logo-363d05ef-1778171494834.webp" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">ExamPro</h1>
            <p className="text-xs text-slate-500">Grade {teacher.grade} Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'students' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users size={20} />
            Students
          </button>
          <button 
            onClick={() => setView('records')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'records' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ClipboardCheck size={20} />
            Exam Scores
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
            <img src={teacher.avatar} alt={teacher.name} className="w-8 h-8 rounded-full bg-blue-100" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">{teacher.name}</p>
              <p className="text-[10px] text-slate-500">Teacher</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {view === 'students' ? 'Student Management' : 'Exam Records'}
            </h2>
            <p className="text-sm text-slate-500">Managing Grade {teacher.grade} academic data</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search students..." 
                className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {view === 'students' && (
              <Button onClick={() => setIsAddStudentOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                <Plus size={18} className="mr-2" />
                Add Student
              </Button>
            )}
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {view === 'students' ? (
              <motion.div
                key="students-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map(student => (
                    <Card key={student.id} className="border-slate-200 hover:shadow-lg transition-shadow overflow-hidden group">
                      <div className="h-2 bg-blue-600 w-full" />
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <UserCircle size={28} />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-900">{student.name}</CardTitle>
                          <p className="text-sm text-slate-500 font-mono">{student.rollNumber}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-4">
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Average</p>
                            <p className="text-lg font-bold text-slate-900">{calculateAverage(student.id)}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Grade</p>
                            <p className="text-lg font-bold text-blue-600">{getGradeLetter(calculateAverage(student.id))}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Status</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full border-slate-200 text-slate-600 hover:bg-slate-50"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsReportOpen(true);
                          }}
                        >
                          <FileText size={16} className="mr-2" />
                          View Report Card
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200">
                      <Users size={48} className="text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">No students found matching your search</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="records-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-slate-200 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-700">Student</TableHead>
                        {teacherSubjects.map(sub => (
                          <TableHead key={sub.id} className="text-center font-bold text-slate-700 min-w-[100px]">
                            {sub.name}
                          </TableHead>
                        ))}
                        <TableHead className="text-center font-bold text-slate-700">Avg %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map(student => (
                        <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium text-slate-900">
                            <div>
                              <p>{student.name}</p>
                              <p className="text-xs text-slate-500 font-mono">{student.rollNumber}</p>
                            </div>
                          </TableCell>
                          {teacherSubjects.map(sub => (
                            <TableCell key={sub.id} className="p-2">
                              <Input 
                                type="number" 
                                min="0" 
                                max="100"
                                value={getStudentScore(student.id, sub.id)}
                                onChange={(e) => handleUpdateScore(student.id, sub.id, e.target.value)}
                                className="w-20 mx-auto text-center h-9 focus:ring-blue-500 border-slate-200"
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-bold text-slate-900">
                            <span className={`px-2 py-1 rounded ${parseFloat(calculateAverage(student.id)) >= 50 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                              {calculateAverage(student.id)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="John Doe" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roll">Roll Number / ID</Label>
              <Input 
                id="roll" 
                value={newStudent.rollNumber}
                onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                placeholder={`G${teacher.grade}-XXX`} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">Create Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Card Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Academic Performance Report
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.name}</h3>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span>Grade: {selectedStudent.grade}</span>
                    <span>Roll No: {selectedStudent.rollNumber}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Term Results</p>
                  <p className="text-3xl font-black text-blue-600">
                    {getGradeLetter(calculateAverage(selectedStudent.id))}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-50 border-none shadow-none p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Overall Average</p>
                  <p className="text-2xl font-bold text-slate-900">{calculateAverage(selectedStudent.id)}%</p>
                </Card>
                <Card className="bg-slate-50 border-none shadow-none p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Class Standing</p>
                  <p className="text-2xl font-bold text-slate-900">N/A</p>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-slate-400" />
                  Subject Analysis
                </h4>
                <div className="grid gap-2">
                  {teacherSubjects.map(sub => {
                    const score = getStudentScore(selectedStudent.id, sub.id);
                    return (
                      <div key={sub.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                        <span className="text-slate-700 font-medium">{sub.name}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              className={`h-full ${score >= 50 ? 'bg-blue-600' : 'bg-red-500'}`}
                            />
                          </div>
                          <span className={`font-bold min-w-[40px] text-right ${score >= 50 ? 'text-slate-900' : 'text-red-600'}`}>
                            {score}/100
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardCheck size={18} className="text-slate-400" />
                  Teacher's Remarks
                </h4>
                <Textarea 
                  className="min-h-[100px] border-slate-200 focus:ring-blue-500"
                  placeholder="Enter comments on student progress..."
                  value={getStudentComment(selectedStudent.id)}
                  onChange={(e) => handleUpdateComment(selectedStudent.id, e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => toast.success('Report downloaded!')}>
                  <Download size={18} className="mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsReportOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;