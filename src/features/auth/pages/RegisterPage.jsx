import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { registerSchema } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phoneNumber: '', password: '', roleName: 'USER' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2">Join BarberX ERP today</p>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
            
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1234567890"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <select
                className={`input-field ${errors.roleName ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('roleName')}
              >
                <option value="USER">Customer</option>
                <option value="BARBER">Barber</option>
              </select>
              {errors.roleName && <span className="text-xs text-red-500 mt-1">{errors.roleName.message}</span>}
            </div>
            
            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Register
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

