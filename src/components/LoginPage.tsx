import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 grayscale-[20%]" 
        style={{ 
          backgroundImage: 'url("https://storage.googleapis.com/dala-prod-public-storage/generated-images/adde22be-3f86-44f5-bd78-4113e176c3ce/login-bg-1e9aa9d8-1778171494619.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl shadow-slate-900/10 overflow-hidden bg-white/90 backdrop-blur-md">
          <div className="h-2 bg-blue-600 w-full" />
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto w-20 h-20 mb-4 overflow-hidden rounded-2xl bg-white flex items-center justify-center p-2 shadow-sm border border-slate-100">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/adde22be-3f86-44f5-bd78-4113e176c3ce/school-logo-363d05ef-1778171494834.webp" 
                alt="ExamPro Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">ExamPro</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Academic Management Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-semibold">Teacher Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    id="username"
                    placeholder="e.g. teacher1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Demo: teacher1 through teacher9</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Demo: password123</p>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}
              </Button>
            </form>
          </CardContent>
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Authorized personnel only. Secure login enabled.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;