import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userApi } from '../../api/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * SettingsPage Component
 * 
 * High-fidelity profile and security management for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS primitives
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic, Auth store integration, and Zod validation
 * - Features high-impact profile forms and a clear security checklist
 */

const schema = z.object({
  name: z.string().min(3).max(80),
  location: z.string().max(120).optional(),
  bio: z.string().max(200).optional(),
  householdSize: z.number().min(1).max(12).optional()
});

const SettingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data, isLoading: isQueryLoading } = useQuery({ 
    queryKey: ['me'], 
    queryFn: userApi.me, 
    // initialData: user 
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      location: user?.profile?.location || '',
      bio: user?.profile?.bio || '',
      householdSize: user?.profile?.householdSize || 1
    }
  });

  useEffect(() => {
  if (!data) return;

  reset({
    name: data?.name ?? '',
    location: data?.profile?.location ?? '',
    bio: data?.profile?.bio ?? '',
    householdSize: data?.profile?.householdSize ?? 1
  });

  }, [data?.id]);

  const mutation = useMutation({
    mutationFn: userApi.update,
    onSuccess: (updated) => {
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
      updateUser(updated);
    },
    onError: (error) => enqueueSnackbar(error.response?.data?.message || 'Unable to update profile', { variant: 'error' })
  });

  const onSubmit = (values) => {
    mutation.mutate({
      name: values.name,
      profile: {
        location: values.location,
        bio: values.bio,
        householdSize: Number(values.householdSize)
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-teal-600 mb-2">
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability Command Center</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2 text-balance">Profile & security</h1>
        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
          Keep your profile up to date and make verification a priority to unlock full community access.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Personal Information Form */}
        <div className="lg:col-span-7">
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative">
            <h2 className="text-xl font-bold text-[#1b4332] font-headline mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-500">person_outline</span>
              Personal information
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    {...register('name')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.name ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="Alex Rivers"
                  />
                  {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.name.message}</p>}
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location</label>
                  <input
                    {...register('location')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.location ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="e.g. San Francisco, CA"
                  />
                  {errors.location && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.location.message}</p>}
                </div>
              </div>

              {/* Household Size */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Household Size</label>
                <div className="flex items-center gap-4">
                   <input
                    type="number"
                    min="1"
                    max="12"
                    {...register('householdSize', { valueAsNumber: true })}
                    className="w-24 bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 font-medium">Persons (Used for more accurate per-capita carbon modeling)</p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bio / Sustainability Mission</label>
                <textarea
                  {...register('bio')}
                  rows="4"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none resize-none"
                  placeholder="Tell the community about your environmental journey..."
                />
                <div className="flex justify-between mt-1 px-1">
                   {errors.bio ? <p className="text-[10px] font-bold text-red-500 uppercase">{errors.bio.message}</p> : <span></span>}
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Max 200 characters</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <button
                  disabled={isSubmitting || mutation.isLoading}
                  type="submit"
                  className="w-full md:w-auto bg-[#1b4332] text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {(isSubmitting || mutation.isLoading) ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Save changes</span>
                      <span className="material-symbols-outlined">check_circle</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Decorative Icon */}
            <div className="absolute top-0 right-0 opacity-[0.02] translate-x-4 -translate-y-4 pointer-events-none">
               <span className="material-symbols-outlined text-[180px]">manage_accounts</span>
            </div>
          </section>
        </div>

        {/* Security & Verification Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Verification Alert */}
          {!user?.isVerified && (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] flex gap-4 items-start shadow-sm shadow-amber-900/5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm mb-1">Verify your account</h4>
                <p className="text-xs text-amber-800/70 leading-relaxed mb-3">
                  Verify your email to unlock advanced analytics, business workspace creation, and community posting.
                </p>
                <button className="text-[10px] font-bold text-amber-700 uppercase tracking-widest hover:underline flex items-center gap-1">
                  Resend verification link <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Checklist */}
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-[#1b4332] font-headline mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-500">shield</span>
              Security checklist
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">
              Ecotrakify enforces strong passwords and session refresh tokens to keep your environmental data secure.
            </p>
            
            <div className="space-y-4">
              {[
                { label: 'Keep notifications enabled for goal reminders', icon: 'active' },
                { label: 'Review business workspace access regularly', icon: 'fare' },
                { label: 'Use a unique password for this service', icon: 'key' },
                { label: 'Contact support for account deletion requests', icon: 'delete' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-[#1b4332]/10 transition-colors">
                   <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1b4332] shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                   </div>
                   <p className="text-xs text-gray-600 font-medium leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
               <button className="w-full py-3 bg-gray-50 text-[#1b4332] border border-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:border-[#1b4332]/20 transition-all">
                  Sign out of all devices
               </button>
            </div>
          </section>

          {/* Impact Milestone Widget */}
          <div className="bg-[#0b2b1e] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-4">Account Integrity</p>
                <h4 className="font-bold text-lg mb-2">Scientific Transparency</h4>
                <p className="text-emerald-50/60 text-xs leading-relaxed">
                   Your profile data helps us refine global benchmarks. We <span className="text-teal-400 font-bold">never sell</span> your individual footprint data to third parties.
                </p>
             </div>
             {/* Decorative Ring */}
             <div className="absolute -bottom-10 -right-10 w-32 h-32 border-4 border-white/5 rounded-full"></div>
             <div className="absolute top-0 left-0 opacity-[0.05] -translate-x-1/4 -translate-y-1/4">
                <span className="material-symbols-outlined text-9xl">verified</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
