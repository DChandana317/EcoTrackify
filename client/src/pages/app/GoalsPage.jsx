import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { goalApi } from '../../api/index.js';

/**
 * GoalsPage Component
 * 
 * High-fidelity sustainability goal management for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS primitives
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic and Zod validation
 * - Features high-impact progress tracking and SMART target setting
 */

const schema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(300).optional(),
  targetValue: z.number().min(1).max(10_000),
  unit: z.string().min(1).default('%'),
  baselineValue: z.number().min(0).optional().default(0),
  targetDate: z
    .string()
    .refine((value) => dayjs(value).diff(dayjs(), 'day') >= 7, {
      message: 'Goals must be at least 7 days in the future'
    }),
  cadence: z.enum(['daily', 'weekly', 'monthly']).default('weekly')
});

const cadences = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

const goalStatusStyles = (status) => {
  switch (status) {
    case 'completed':
    case 'on_track':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'off_track':
      return 'bg-red-50 text-red-700 border-red-100';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-100';
  }
};

const GoalsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      targetValue: 10,
      unit: '%',
      baselineValue: 0,
      targetDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
      cadence: 'weekly'
    }
  });

  const { data, isLoading } = useQuery({ queryKey: ['goals'], queryFn: goalApi.list });

  const createMutation = useMutation({
    mutationFn: goalApi.create,
    onSuccess: () => {
      enqueueSnackbar('Goal created successfully', { variant: 'success' });
      queryClient.invalidateQueries(['goals']);
      reset({
        title: '',
        description: '',
        targetValue: 10,
        unit: '%',
        baselineValue: 0,
        targetDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
        cadence: 'weekly'
      });
    },
    onError: (error) => enqueueSnackbar(error.response?.data?.message || 'Unable to create goal', { variant: 'error' })
  });

  const onSubmit = (values) => {
    createMutation.mutate({
      ...values,
      targetValue: Number(values.targetValue),
      baselineValue: Number(values.baselineValue)
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-teal-600 mb-2">
          <span className="material-symbols-outlined text-sm">Track_changes</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability Command Center</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2">Sustainability goals</h1>
        <p className="text-gray-500 max-w-2xl">
          Set realistic SMART targets. Ecotrakify prevents unrealistic timelines and captures progress history.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#1b4332] font-headline mb-8">Define new goal</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Goal Title</label>
                <input
                  {...register('title')}
                  className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                    errors.title ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                  }`}
                  placeholder="e.g. Reduce Weekly Car Usage"
                />
                {errors.title && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  {...register('description')}
                  rows="2"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none resize-none"
                  placeholder="What's the context for this goal?"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Target Value */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Target Value</label>
                  <input
                    type="number"
                    {...register('targetValue', { valueAsNumber: true })}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                  />
                  {errors.targetValue && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.targetValue.message}</p>}
                </div>
                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                  <input
                    {...register('unit')}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                    placeholder="%, kg, km..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Baseline */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Baseline Value</label>
                  <input
                    type="number"
                    {...register('baselineValue', { valueAsNumber: true })}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                  />
                </div>
                {/* Target Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Target Date</label>
                  <input
                    type="date"
                    {...register('targetDate')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.targetDate ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                  />
                  {errors.targetDate && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.targetDate.message}</p>}
                </div>
              </div>

              {/* Cadence Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Check-in Cadence</label>
                <div className="grid grid-cols-3 gap-2">
                  {cadences.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      // Use React Hook Form's setValue if we wanted to avoid select, 
                      // but keeping as a standard select for simplicity in this iteration
                      // unless we want to rebuild the full radio-toggle UI.
                    />
                  ))}
                  <select
                    {...register('cadence')}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none appearance-none col-span-3"
                  >
                    {cadences.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                disabled={isSubmitting || createMutation.isLoading}
                type="submit"
                className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {(isSubmitting || createMutation.isLoading) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating goal...</span>
                  </>
                ) : (
                  <>
                    <span>Create goal</span>
                    <span className="material-symbols-outlined">add_task</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Goals List Column */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <div className="bg-white p-20 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-teal-50 border-t-[#1b4332] rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Syncing goals...</p>
            </div>
          ) : data?.length > 0 ? (
            data.map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <div key={goal._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#1b4332] font-headline">{goal.title}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Due {dayjs(goal.targetDate).format('MMM D, YYYY')} • {goal.cadence} Check-in
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${goalStatusStyles(goal.status)}`}>
                      {goal.status?.replace('_', ' ')}
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Progress</p>
                        <p className="text-2xl font-bold text-[#1b4332] font-headline">
                          {goal.currentValue} <span className="text-sm font-medium text-gray-400">/ {goal.targetValue} {goal.unit}</span>
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-teal-600 font-headline">{progress}%</p>
                    </div>

                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1b4332] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(27,67,50,0.2)]"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Subtle Background Icon */}
                  <div className="absolute top-0 right-0 opacity-[0.03] translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <span className="material-symbols-outlined text-9xl">track_changes</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-20 rounded-[32px] border border-gray-100 border-dashed text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <span className="material-symbols-outlined text-4xl">flag</span>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#1b4332]">No active goals</p>
                <p className="text-gray-400 max-w-[280px] mx-auto text-sm leading-relaxed">
                  Start your sustainability journey by defining your first SMART objective today.
                </p>
              </div>
            </div>
          )}

          {/* Impact Insight Card */}
          <div className="bg-[#0b2b1e] p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10 flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-teal-400/20 flex items-center justify-center text-teal-400">
                   <span className="material-symbols-outlined text-3xl">Tip</span>
                </div>
                <div>
                   <h4 className="font-bold text-lg mb-1">SMART Goal Tip</h4>
                   <p className="text-emerald-50/60 text-sm leading-relaxed">
                      Goals with a weekly cadence are <span className="text-teal-400 font-bold">42% more likely</span> to be achieved on our platform.
                   </p>
                </div>
             </div>
             {/* Decorative Ring */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 border-4 border-white/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
