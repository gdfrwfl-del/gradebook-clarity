import React, { useState } from 'react';
import { Subject } from '../../lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, Book } from 'lucide-react';
import { toast } from 'sonner';

interface ManageSubjectsProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const ManageSubjects: React.FC<ManageSubjectsProps> = ({ subjects, setSubjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    maxScore: 100
  });

  const handleOpenModal = (sub?: Subject) => {
    if (sub) {
      setEditingSubject(sub);
      setFormData({ name: sub.name, maxScore: sub.maxScore });
    } else {
      setEditingSubject(null);
      setFormData({ name: '', maxScore: 100 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Subject name is required');
      return;
    }

    if (editingSubject) {
      setSubjects(prev => prev.map(s => 
        s.id === editingSubject.id ? { ...s, ...formData } : s
      ));
      toast.success('Subject updated');
    } else {
      const newSub: Subject = {
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        maxScore: formData.maxScore
      };
      setSubjects(prev => [...prev, newSub]);
      toast.success('Subject added');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subject? It may affect existing records.')) {
      setSubjects(prev => prev.filter(s => s.id !== id));
      toast.success('Subject deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Book className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Curriculum Management</h3>
            <p className="text-sm text-slate-500">Configure subjects and scoring standards</p>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200">
          <Plus size={18} className="mr-2" />
          Add Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(sub => (
          <Card key={sub.id} className="group border-slate-200 hover:border-purple-300 transition-all shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</p>
                  <h4 className="text-xl font-bold text-slate-900">{sub.name}</h4>
                  <p className="text-sm text-slate-500">Max Score: {sub.maxScore}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(sub)} className="h-8 w-8">
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)} className="h-8 w-8 text-red-500">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'New Subject'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Subject Name</Label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Physics" 
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Score</Label>
              <Input 
                type="number"
                value={formData.maxScore}
                onChange={e => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">Save Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSubjects;