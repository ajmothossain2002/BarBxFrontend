import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import Button from '../../../common/components/Button';
import { LogOut, User, Mail, ShieldAlert } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-slate-900 tracking-tight">BarberX ERP</div>
        <Button variant="secondary" onClick={handleLogout} className="!py-1.5 !px-3 text-sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card flex items-start space-x-4">
            <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Welcome back</p>
              <p className="text-lg font-semibold text-slate-900">{user?.fullName || 'User'}</p>
            </div>
          </div>
          
          <div className="card flex items-start space-x-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email Address</p>
              <p className="text-lg font-semibold text-slate-900">{user?.email || 'N/A'}</p>
            </div>
          </div>
          
          <div className="card flex items-start space-x-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Access Role</p>
              <p className="text-lg font-semibold text-slate-900 capitalize">{user?.role?.toLowerCase() || 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
