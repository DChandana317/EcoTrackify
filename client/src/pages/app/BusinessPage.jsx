import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@tanstack/react-query';
import { businessApi } from '../../api/index.js';
import { useAuthStore } from '../../store/useAuthStore.js';

/**
 * BusinessPage Component
 * 
 * High-fidelity business analytics and workspace management for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS primitives
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic, Auth store integration, and Zod validation
 * - Features high-impact stat cards and a clear workspace setup flow
 */

const schema = z.object({
  name: z.string().min(3).max(120),
  domain: z.string().min(3).regex(/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Enter a valid company domain')
});

const StatCardLocal = ({ label, value, helper, icon }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#1b4332]">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-[#1b4332] font-headline">{value}</p>
      </div>
    </div>
    <p className="text-xs text-gray-500 border-t border-gray-50 pt-3">{helper}</p>
  </div>
);

const BusinessPage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { enqueueSnackbar } = useSnackbar();
  const isBusinessAdmin = React.useMemo(
    () => user?.roles?.includes('business_admin') ?? false,
    [user?.roles]
  );

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['business-dashboard'],
    queryFn: businessApi.dashboard,
    enabled: Boolean(user?.businessId && isBusinessAdmin)
  });

  const totalsByCategory = data?.totalsByCategory || {};
  const totalCompanyCO2e = Object.values(totalsByCategory).reduce((sum, value) => sum + value, 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { name: '', domain: '' } 
  });

  const createBusiness = useMutation({
    mutationFn: businessApi.create,
    onSuccess: (business) => {
      enqueueSnackbar('Business workspace created', { variant: 'success' });
      const roles = Array.from(new Set([...(user?.roles || []), 'business_admin']));
      if (user?.businessId !== business._id) {
        updateUser({
          businessId: business._id,roles
        });
      }
    },
    onError: (err) => enqueueSnackbar(err.response?.data?.message || 'Unable to create business', { variant: 'error' })
  });

  const onSubmit = (values) => {
    createBusiness.mutate(values);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-teal-600 mb-2">
          <span className="material-symbols-outlined text-sm">business_center</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability Command Center</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2 text-balance">Business analytics</h1>
        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
          {user?.businessId
            ? 'Review aggregated employee impact, celebrate wins, and share resources across your organization.'
            : 'Spin up a business workspace to support employees on their sustainability journey and track corporate ESG metrics.'}
        </p>
      </header>

      {/* State: No Business Workspace */}
      {!user?.businessId && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5">
            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
              <h2 className="text-xl font-bold text-[#1b4332] font-headline mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-500">add_business</span>
                Create business account
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1" noValidate>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                  <input
                    {...register('name')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.name ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="e.g. Acme Corp"
                  />
                  {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Company Domain</label>
                  <input
                    {...register('domain')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.domain ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="example.com"
                  />
                  <p className="text-[9px] text-gray-400 ml-1 font-medium italic">
                    {errors.domain?.message || 'Only approved domains can enroll during this pilot phase.'}
                  </p>
                </div>

                <button
                  disabled={isSubmitting || createBusiness.isLoading}
                  type="submit"
                  className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                >
                  {(isSubmitting || createBusiness.isLoading) ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Create workspace</span>
                      <span className="material-symbols-outlined">rocket_launch</span>
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#0b2b1e] p-10 rounded-[32px] text-white h-full relative overflow-hidden flex flex-col justify-center">
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-teal-400/20 flex items-center justify-center text-teal-400">
                  <span className="material-symbols-outlined text-4xl">verified</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold font-headline">Enterprise-Grade Insights</h3>
                  <p className="text-emerald-50/60 leading-relaxed max-w-md">
                    Business accounts unlock aggregated dashboards, employee invitations, and curated sustainability resources tailored for professional teams.
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    'Aggregated CO₂e Reporting',
                    'Employee Privacy Controls',
                    'Verified Sustainability Resources',
                    'Corporate Impact Milestones'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-emerald-100/80">
                      <span className="material-symbols-outlined text-teal-400 text-lg">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#1b4332] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 opacity-40"></div>
              <div className="absolute -bottom-10 -right-10 opacity-[0.05] pointer-events-none">
                <span className="material-symbols-outlined text-[240px]">corporate_fare</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State: Has Workspace */}
      {user?.businessId && (
        <div className="space-y-8">
          {/* Access Control Messages */}
          {!isBusinessAdmin && (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1b4332]">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div>
                <p className="font-bold text-[#1b4332] text-sm">Workspace Member</p>
                <p className="text-xs text-emerald-900/60">You are part of a business workspace. Reach out to an administrator to gain access to organization-wide analytics.</p>
              </div>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined">error</span>
              </div>
              <div>
                <p className="font-bold text-red-800 text-sm">Data Loading Error</p>
                <p className="text-xs text-red-900/60">{error?.response?.data?.message || 'Unable to load business data at this time.'}</p>
              </div>
            </div>
          )}

          {/* Analytics Dashboard */}
          {isBusinessAdmin && !isError && (
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-4 border-teal-50 border-t-[#1b4332] rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Aggregating company impact...</p>
                </div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCardLocal
                      label="Company CO₂e"
                      value={`${totalCompanyCO2e.toFixed(1)} kg`}
                      helper="Aggregated company-wide footprint"
                      icon="analytics"
                    />
                    <StatCardLocal
                      label="Goals Achieved"
                      value={`${data?.goals?.completed || 0} / ${data?.goals?.total || 0}`}
                      helper="Employee target completion rate"
                      icon="task_alt"
                    />
                    <StatCardLocal
                      label="Active Accounts"
                      value={data?.business?.employees?.length || 0}
                      helper="Connected employee profiles"
                      icon="groups"
                    />
                  </div>

                  {/* Resources Section */}
                  <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-[#1b4332] font-headline">Resources for teams</h2>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Curated Growth Material</p>
                      </div>
                      <button className="text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-widest">Submit resource</button>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {(data?.business?.resources || [
                        { title: 'Low-impact commute handbook', description: 'Proven corporate policies and stipend ideas for sustainable transit.' },
                        { title: 'Green workspace challenges', description: 'Monthly gamified prompts to keep employees engaged in carbon reduction.' }
                      ]).map((resource, index) => (
                        <div key={index} className="p-8 flex items-start gap-6 hover:bg-gray-50/50 transition-colors group">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#1b4332] group-hover:bg-[#1b4332] group-hover:text-white transition-all shrink-0">
                            <span className="material-symbols-outlined">auto_stories</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-[#1b4332] transition-colors">{resource.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mt-1">{resource.description}</p>
                            <button className="mt-4 text-[10px] font-bold text-[#1b4332] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                              Access Resource <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Decorative Banner */}
                    <div className="p-6 bg-[#0b2b1e] text-white relative overflow-hidden flex items-center justify-between">
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-400">
                          <span className="material-symbols-outlined">diversity_3</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Team Momentum</p>
                          <p className="text-xs font-medium">Your team is in the <span className="text-teal-400 font-bold">Top 5%</span> for active tracking this week.</p>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 opacity-[0.05] translate-x-4 -translate-y-4">
                        <span className="material-symbols-outlined text-8xl">trending_up</span>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessPage;
