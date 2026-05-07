import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading Academic System...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return user.role === 'admin' ? <AdminDashboard /> : <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen font-sans antialiased">
        <AppContent />
        <Toaster position="top-center" richColors />
      </div>
    </AuthProvider>
  );
}

export default App;