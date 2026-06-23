import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authApi } from '../../api/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * LoginPage Component
 * 
 * High-fidelity authentication screen for Ecotrakify.
 * Refined with the Eco-Modern design system, featuring:
 * - Form validation with Zod & React Hook Form
 * - Clean Tailwind CSS styling replacing MUI
 * - Preserved MERN stack logic and state management
 */

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const setSession = useAuthStore((state) => state.setSession);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (values) => {
    try {
      const data = await authApi.login(values);
      setSession(data);
      enqueueSnackbar('Welcome back! Redirecting to your dashboard.', { variant: 'success' });
      navigate(location.state?.from?.pathname || '/app/dashboard', { replace: true });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Unable to login. Please try again.', {
        variant: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] font-sans text-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1b4332]/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 opacity-60"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo / Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <RouterLink to="/" className="flex items-center gap-2 text-[#1b4332] font-headline font-bold text-3xl mb-2">
            <span className="material-symbols-outlined text-4xl"></span>
            Ecotrakify
          </RouterLink>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Sustainability Command Center</p>
        </div>

        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1b4332] font-headline mb-2">Log back in</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Track today’s impact and stay on pace with your sustainability goals.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors">
                  mail
                </span>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-12 pr-4 text-sm transition-all focus:outline-none focus:bg-white ${
                    errors.email ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                  }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <RouterLink to="/auth/forgot" className="text-xs font-bold text-[#1b4332] hover:underline">
                  Forgot?
                </RouterLink>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors">
                  lock
                </span>
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-12 pr-4 text-sm transition-all focus:outline-none focus:bg-white ${
                    errors.password ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.password.message}</p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <span className="material-symbols-outlined">login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="bg-teal-50/50 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-100 flex items-center justify-center text-[#1b4332]">
                <span className="material-symbols-outlined">add</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  New to the movement? <RouterLink to="/auth/register" className="text-[#1b4332] font-bold hover:underline">Create your account</RouterLink> in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Secured by enterprise-grade encryption
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
