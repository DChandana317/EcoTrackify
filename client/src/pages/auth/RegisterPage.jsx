import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authApi } from '../../api/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * RegisterPage Component
 * 
 * High-fidelity registration screen for Ecotrakify.
 * Refined with the Eco-Modern design system, featuring:
 * - Complex form validation with Zod (Password matching, Regex, Terms)
 * - Custom Tailwind CSS UI replacing MUI
 * - Preserved MERN stack logic and state management
 */

const schema = z
  .object({
    name: z.string().min(3, 'Name must include at least 3 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(10, 'Use at least 10 characters')
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, 'Include upper, lower, number & symbol'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Please accept the terms to continue' })
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values;
      const data = await authApi.register(payload);
      setSession(data);
      enqueueSnackbar('Account created! Please verify your email to unlock all features.', {
        variant: 'success'
      });
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Unable to register right now.', {
        variant: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] font-sans text-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration - Consistent with Login */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1b4332]/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 opacity-60"></div>

      <div className="max-w-xl w-full relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <RouterLink to="/" className="flex items-center gap-2 text-[#1b4332] font-headline font-bold text-3xl mb-2">
            <span className="material-symbols-outlined text-4xl"></span>
            Ecotrakify
          </RouterLink>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Scale Your Impact</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#1b4332] font-headline mb-3">Start your journey</h1>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Join thousands of eco-conscious leaders tracking real-time sustainability metrics.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors">person</span>
                  <input
                    {...register('name')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-12 pr-4 text-sm transition-all focus:outline-none focus:bg-white ${
                      errors.name ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="Alex Rivers"
                  />
                </div>
                {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors">mail</span>
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-12 pr-4 text-sm transition-all focus:outline-none focus:bg-white ${
                      errors.email ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="alex@company.com"
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors">lock</span>
                  <input
                    {...register('password')}
                    type="password"
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-12 pr-4 text-sm transition-all focus:outline-none focus:bg-white ${
                      errors.password ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="••••••••••••"
                  />
                </div>
                {errors.password ? (
                  <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.password.message}</p>
                ) : (
                  <p className="text-[9px] text-gray-400 ml-1 leading-tight">Must include upper, lower, number & symbol.</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors">shield</span>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-12 pr-4 text-sm transition-all focus:outline-none focus:bg-white ${
                      errors.confirmPassword ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="••••••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms of Service */}
            <div className="space-y-3">
              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        {...field}
                        checked={field.value}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-md bg-white peer-checked:bg-[#1b4332] peer-checked:border-[#1b4332] transition-all"></div>
                      <span className="material-symbols-outlined absolute inset-0 text-white text-[16px] flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                    </div>
                    <span className="text-xs text-gray-500 leading-normal">
                      I agree to the <a href="#" className="text-[#1b4332] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#1b4332] font-bold hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                )}
              />
              {errors.acceptTerms && (
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                  <p className="text-[10px] font-bold text-amber-700 uppercase">{errors.acceptTerms.message}</p>
                </div>
              )}
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <span className="material-symbols-outlined">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <RouterLink to="/auth/login" className="text-[#1b4332] font-bold hover:underline">Sign in</RouterLink>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Join 12,000+ sustainability officers worldwide
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
