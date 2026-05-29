import axiosInstance from '../../../common/api/axiosInstance';

/**
 * Admin API service for user, role, and permission management.
 * All endpoints require ADMIN role authentication.
 */
export const adminApi = {
  // ─── Users ───────────────────────────────────────────────
  getUsers: async () => {
    const response = await axiosInstance.get('/api/v1/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosInstance.get(`/api/v1/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, roleName) => {
    const response = await axiosInstance.put(`/api/v1/users/${id}/role`, { roleName });
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await axiosInstance.put(`/api/v1/users/${id}/status`, { status });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/api/v1/users/${id}`);
    return response.data;
  },

  // ─── Roles ───────────────────────────────────────────────
  getRoles: async () => {
    const response = await axiosInstance.get('/api/v1/roles');
    return response.data;
  },

  // ─── Permissions ─────────────────────────────────────────
  getPermissions: async () => {
    const response = await axiosInstance.get('/api/v1/permissions');
    return response.data;
  },
};
