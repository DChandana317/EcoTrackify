import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tipApi } from '../../api/index.js';

/**
 * CommunityPage Component
 * 
 * High-fidelity community interaction hub for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS primitives
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic and Zod validation
 * - Features high-impact tip cards and a specialized search experience
 */

const schema = z.object({
  title: z.string().min(5).max(120),
  body: z.string().min(50, 'Share at least 50 characters').max(1000),
  tags: z.string().optional()
});

const CommunityPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isFetching } = useQuery({
    queryKey: ['tips', search],
    queryFn: () => tipApi.list(search ? { search } : undefined)
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', body: '', tags: '' }
  });

  const createMutation = useMutation({
    mutationFn: ({ tags, ...payload }) => tipApi.create({
      ...payload,
      tags: tags
        ?.split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5)
    }),
    onSuccess: () => {
      enqueueSnackbar('Tip shared with the community!', { variant: 'success' });
      queryClient.invalidateQueries(['tips']);
      reset({ title: '', body: '', tags: '' });
    },
    onError: (error) => enqueueSnackbar(error.response?.data?.message || 'Unable to share tip', { variant: 'error' })
  });

  const likeMutation = useMutation({
    mutationFn: tipApi.toggleLike,
    onSuccess: () => queryClient.invalidateQueries(['tips'])
  });

  const onSubmit = (values) => {
    createMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-teal-600 mb-2">
            <span className="material-symbols-outlined text-sm">groups</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Community Hub</span>
          </div>
          <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2">Eco-friendly practices</h1>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            Discover and share real-life tactics. Our platform automatically screens for safety to ensure a positive impact.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:w-80 relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1b4332] transition-colors"></span>
          <input
            type="text"
            placeholder="Search practices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm shadow-sm transition-all focus:bg-white focus:border-[#1b4332] focus:outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-28">
            <h2 className="text-xl font-bold text-[#1b4332] font-headline mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-500">campaign</span>
              Share a proven eco tip
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Practice Title</label>
                <input
                  {...register('title')}
                  className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                    errors.title ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                  }`}
                  placeholder="e.g. Smart Composting for Small Apartments"
                />
                {errors.title && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.title.message}</p>}
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Advice</label>
                <textarea
                  {...register('body')}
                  rows="5"
                  className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none resize-none ${
                    errors.body ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                  }`}
                  placeholder="Share actionable steps, resources, or measurable outcomes..."
                />
                {errors.body ? (
                  <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.body.message}</p>
                ) : (
                  <p className="text-[9px] text-gray-400 ml-1 font-medium italic">At least 50 characters required.</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Keywords (Comma separated)</label>
                <input
                  {...register('tags')}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                  placeholder="transport, food, energy, waste..."
                />
                <p className="text-[9px] text-gray-400 ml-1 font-medium italic">Up to 5 keywords.</p>
              </div>

              <button
                disabled={isSubmitting || createMutation.isLoading}
                type="submit"
                className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {(isSubmitting || createMutation.isLoading) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish tip</span>
                    <span className="material-symbols-outlined">send</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Tips Feed Column */}
        <div className="lg:col-span-7 space-y-6">
          {isFetching && !data ? (
            <div className="bg-white p-20 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-teal-50 border-t-[#1b4332] rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Refreshing community feed...</p>
            </div>
          ) : data?.length > 0 ? (
            data.map((tip) => (
              <div key={tip._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1b4332] font-headline mb-3 group-hover:text-teal-700 transition-colors">{tip.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      {tip.body}
                    </p>
                  </div>
                  <button
                    onClick={() => likeMutation.mutate(tip._id)}
                    disabled={likeMutation.isLoading}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                      tip.likes?.includes('current-user-id') // Example placeholder logic for liked state
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <span className={`material-symbols-outlined ${tip.likes?.length > 0 ? 'fill-current' : ''}`}>favorite</span>
                    <span className="text-[10px] font-bold">{tip.likes?.length || 0}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                  {(tip.tags || []).map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-emerald-50 text-[#1b4332] text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                      #{tag}
                    </span>
                  ))}
                  {(!tip.tags || tip.tags.length === 0) && (
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No tags</span>
                  )}
                </div>

                {/* Decorative Pattern */}
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <span className="material-symbols-outlined text-[200px]">eco</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[32px] border border-gray-100 border-dashed text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <span className="material-symbols-outlined text-4xl">search_off</span>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#1b4332]">No practices found</p>
                <p className="text-gray-400 max-w-[280px] mx-auto text-sm leading-relaxed">
                  We couldn't find any tips matching "{search}". Try adjusting your keywords or browse the feed.
                </p>
                <button 
                  onClick={() => setSearch('')}
                  className="text-sm font-bold text-teal-600 hover:underline mt-4"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Engagement Card */}
          <div className="bg-[#0b2b1e] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-teal-400/20 flex items-center justify-center text-teal-400">
                   <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <div>
                   <h4 className="font-bold text-lg mb-1">Impact Vetting</h4>
                   <p className="text-emerald-50/60 text-sm leading-relaxed">
                      Every tip shared is vetted by our <span className="text-teal-400 font-bold">community moderators</span> to ensure scientific accuracy and environmental viability.
                   </p>
                </div>
             </div>
             {/* Decorative Ring */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 border-4 border-white/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
