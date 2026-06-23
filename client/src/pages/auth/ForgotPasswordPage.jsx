import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authApi } from '../../api/index.js';

/**
 * ForgotPasswordPage Component
 * 
 * High-fidelity password recovery screen for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS
 * - Consistent branding and background decorations
 * - Preserves MERN stack logic and Zod validation
 */

const schema = z.object({
  email: z.string().email('Enter a valid email')
});

const ForgotPasswordPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { email: '' } 
  });

  const onSubmit = async (values) => {
    try {
      await authApi.forgotPassword(values);
      enqueueSnackbar('If an account exists, a secure reset link is on the way.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Unable to send reset link right now.', { variant: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] font-sans text-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration - Consistent with Login/Register */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1b4332]/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 opacity-60"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <RouterLink to="/" className="flex items-center gap-2 text-[#1b4332] font-headline font-bold text-3xl mb-2">
            <span className="material-symbols-outlined text-4xl"></span>
            Ecotrakify
          </RouterLink>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Sustainability Command Center</p>
        </div>

        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1b4332] font-headline mb-2">Reset password</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter the email linked to your Ecotrakify workspace. We will send a secure reset link.
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

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending link...</span>
                </>
              ) : (
                <>
                  <span>Send reset link</span>
                  <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <RouterLink to="/auth/login" className="text-sm font-bold text-[#1b4332] hover:underline flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to sign in
            </RouterLink>
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

export default ForgotPasswordPage;
