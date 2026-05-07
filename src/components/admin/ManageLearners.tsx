import React, { useState } from 'react';
import { Student, Grade } from '../../lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, ArrowRightLeft, Search, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ManageLearnersProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const ManageLearners: React.FC<ManageLearnersProps> = ({ students, setStudents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [studentToMove, setStudentToMove] = useState<Student | null>(null);
  const [newGrade, setNewGrade] = useState<string>('');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || String(s.grade) === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handleMove = () => {
    if (!studentToMove || !newGrade) return;

    setStudents(prev => prev.map(s => 
      s.id === studentToMove.id ? { ...s, grade: parseInt(newGrade) as Grade } : s
    ));

    toast.success(`${studentToMove.name} moved to Grade ${newGrade}`);
    setIsMoveModalOpen(false);
    setStudentToMove(null);
    setNewGrade('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="text-emerald-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Student Registrar</h3>
              <p className="text-sm text-slate-500">Managing {students.length} students across 9 grades</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                placeholder="Search by name or ID..." 
                className="pl-10 h-10 border-slate-200"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Filter Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {[1,2,3,4,5,6,7,8,9].map(g => (
                  <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Learner</TableHead>
              <TableHead className="font-bold text-center">Current Grade</TableHead>
              <TableHead className="font-bold">Roll Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.id} className="group hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-900">{student.name}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">
                    Grade {student.grade}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 font-mono text-sm">{student.rollNumber}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setStudentToMove(student);
                      setNewGrade(String(student.grade));
                      setIsMoveModalOpen(true);
                    }}
                    className="border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                  >
                    <ArrowRightLeft size={14} className="mr-2" />
                    Promote/Move
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center">
            <GraduationCap size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No students found in this selection</p>
          </div>
        )}
      </Card>

      <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Move Learner to Grade</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Student</p>
              <p className="font-bold text-slate-900">{studentToMove?.name}</p>
              <p className="text-xs text-slate-500">Currently in Grade {studentToMove?.grade}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Select New Grade</Label>
              <Select value={newGrade} onValueChange={setNewGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Target grade" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9].map(g => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleMove} className="bg-emerald-600 hover:bg-emerald-700">Confirm Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageLearners;