import React, { useState } from 'react';
import { Teacher, Subject, Grade } from '../../lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, UserPlus, Mail, GraduationCap, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface ManageTeachersProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  subjects: Subject[];
}

const ManageTeachers: React.FC<ManageTeachersProps> = ({ teachers, setTeachers, subjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    grade: '1' as any,
    subjectIds: [] as string[]
  });

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        username: teacher.username,
        grade: String(teacher.grade) as any,
        subjectIds: teacher.subjectIds
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        username: '',
        grade: '1' as any,
        subjectIds: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.username) {
      toast.error('Please fill required fields');
      return;
    }

    if (editingTeacher) {
      setTeachers(prev => prev.map(t => 
        t.id === editingTeacher.id 
          ? { ...t, ...formData, grade: parseInt(formData.grade) as Grade } 
          : t
      ));
      toast.success('Teacher updated successfully');
    } else {
      const newTeacher: Teacher = {
        id: `t-${Date.now()}`,
        name: formData.name,
        username: formData.username,
        grade: parseInt(formData.grade) as Grade,
        role: 'teacher',
        subjectIds: formData.subjectIds,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
      };
      setTeachers(prev => [...prev, newTeacher]);
      toast.success('New teacher added');
    }
    setIsModalOpen(false);
  };

  const toggleSubject = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter(id => id !== subjectId)
        : [...prev.subjectIds, subjectId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Faculty Directory</h3>
          <p className="text-sm text-slate-500">Manage {teachers.length} active teachers and their assignments</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
          <UserPlus size={18} className="mr-2" />
          Add Teacher
        </Button>
      </div>

      <Card className="border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Teacher</TableHead>
              <TableHead className="font-bold">Grade</TableHead>
              <TableHead className="font-bold">Assigned Subjects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map(teacher => (
              <TableRow key={teacher.id} className="group hover:bg-slate-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                    <div>
                      <p className="font-bold text-slate-900">{teacher.name}</p>
                      <p className="text-xs text-slate-500">@{teacher.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    Grade {teacher.grade}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjectIds.map(sid => {
                      const sub = subjects.find(s => s.id === sid);
                      return sub ? (
                        <span key={sid} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                          {sub.name}
                        </span>
                      ) : null;
                    })}
                    {teacher.subjectIds.length === 0 && <span className="text-slate-400 text-xs italic">No subjects</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleOpenModal(teacher)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input 
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="janedoe123" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assigned Grade</Label>
              <Select 
                value={formData.grade}
                onValueChange={v => setFormData({ ...formData, grade: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9].map(g => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Assign Subjects</Label>
              <div className="grid grid-cols-2 gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50">
                {subjects.map(sub => (
                  <div key={sub.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`sub-${sub.id}`} 
                      checked={formData.subjectIds.includes(sub.id)}
                      onCheckedChange={() => toggleSubject(sub.id)}
                    />
                    <Label htmlFor={`sub-${sub.id}`} className="text-xs cursor-pointer">{sub.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-blue-600">{editingTeacher ? 'Save Changes' : 'Create Teacher'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTeachers;