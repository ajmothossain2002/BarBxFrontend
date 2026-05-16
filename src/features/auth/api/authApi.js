import axiosInstance from '../../../common/api/axiosInstance';

export const authApi = {
  login: async (data) => {
    const response = await axiosInstance.post('/api/v1/auth/login', data);
    return response.data;
  },
  
  register: async (data) => {
    const response = await axiosInstance.post('/api/v1/auth/register', data);
    return response.data;
  }
};
