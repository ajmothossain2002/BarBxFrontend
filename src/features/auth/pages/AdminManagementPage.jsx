import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Users, Shield, Trash2, RefreshCw, ChevronDown } from 'lucide-react';

import { adminApi } from '../api/adminApi';
import useAuthStore from '../store/useAuthStore';
import Button from '../../../common/components/Button';

const AdminManagementPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Guard: only ADMIN can access
  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getRoles(),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(`role-${userId}`);
    try {
      const res = await adminApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? res.data : u));
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    setActionLoading(`status-${userId}`);
    try {
      const res = await adminApi.updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u.id === userId ? res.data : u));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) return;
    setActionLoading(`delete-${userId}`);
    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    INACTIVE: 'bg-slate-100 text-slate-600',
    SUSPENDED: 'bg-red-100 text-red-700',
    PENDING_VERIFICATION: 'bg-amber-100 text-amber-700',
  };

  const roleColors = {
    ADMIN: 'bg-purple-100 text-purple-700',
    USER: 'bg-blue-100 text-blue-700',
    BARBER: 'bg-teal-100 text-teal-700',
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-surface border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="!p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-xs text-slate-500">User & Role Management</p>
          </div>
        </div>
        <Button variant="secondary" onClick={fetchData} className="!py-1.5 !px-3 text-sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'roles'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            Roles ({roles.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : activeTab === 'users' ? (
          /* ─── Users Table ─────────────────────────────── */
          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">User</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Email</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Phone</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Role</th>
                    <th className="text-left px-6 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-right px-6 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs">
                            {u.fullName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-slate-900">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4 text-slate-600">{u.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={u.roles?.[0] || 'USER'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={actionLoading === `role-${u.id}`}
                            className={`appearance-none text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer border-0 pr-7 ${
                              roleColors[u.roles?.[0]] || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select
                            value={u.status}
                            onChange={(e) => handleStatusChange(u.id, e.target.value)}
                            disabled={actionLoading === `status-${u.id}`}
                            className={`appearance-none text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer border-0 pr-7 ${
                              statusColors[u.status] || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="SUSPENDED">Suspended</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(u.id, u.fullName)}
                          disabled={actionLoading === `delete-${u.id}`}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ─── Roles Grid ──────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${roleColors[role.name] || 'bg-slate-100 text-slate-600'}`}>
                    {role.name}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{role.description || 'No description'}</p>
                {role.permissions && role.permissions.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No permissions assigned</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminManagementPage;
