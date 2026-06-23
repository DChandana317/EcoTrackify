import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { emissionApi } from '../../api/index.js';

dayjs.extend(isSameOrBefore);

/**
 * CarbonTrackerPage Component
 * 
 * High-fidelity activity logging for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI and DataGrid with custom Tailwind CSS
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic and form validation
 * - Features interactive activity selection and impact-focused list
 */

const categories = [
  { id: 'transportation', label: 'Transport', icon: 'directions' },
  { id: 'energy', label: 'Energy', icon: 'bolt' },
  { id: 'waste', label: 'Waste', icon: 'recycling' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'other', label: 'Other', icon: 'category' }
];

const units = ['km', 'miles', 'kwh', 'kg', 'lbs', 'liters', 'gallons', 'items'];

const schema = z.object({
  category: z.string().nonempty('Select a category'),
  subCategory: z.string().optional(),
  quantity: z.number().min(0, 'Quantity cannot be negative').max(1_000_000),
  emissionFactor: z.number().positive('Emission factor must be positive').max(10_000),
  unit: z.string().nonempty('Choose a unit'),
  entryDate: z.string().refine((value) => dayjs(value).isSameOrBefore(dayjs()), {
    message: 'Entry date cannot be in the future'
  }),
  notes: z.string().max(200).optional()
});

const CarbonTrackerPage = () => {
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'transportation',
      subCategory: '',
      quantity: 0,
      emissionFactor: 0,
      unit: 'km',
      entryDate: dayjs().format('YYYY-MM-DD'),
      notes: ''
    }
  });

  const selectedCategory = watch('category');

  const { data, isLoading } = useQuery({ 
    queryKey: ['emissions'], 
    queryFn: () => emissionApi.list({ limit: 20 }) 
  });

  const createMutation = useMutation({
    mutationFn: emissionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['emissions']);
      reset({
        category: 'transportation',
        subCategory: '',
        quantity: 0,
        emissionFactor: 0,
        unit: 'km',
        entryDate: dayjs().format('YYYY-MM-DD'),
        notes: ''
      });
    },
    onError: (error) => {
      // In a real app, you'd use enqueueSnackbar here
      console.error(error.response?.data?.message || 'Unable to log entry');
    }
  });

  const onSubmit = (values) => {
    createMutation.mutate({
      ...values,
      quantity: Number(values.quantity),
      emissionFactor: Number(values.emissionFactor)
    });
  };

  const entries = useMemo(() => data?.entries || [], [data]);

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-teal-600 mb-2">
          <span className="material-symbols-outlined text-sm"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability Command Center</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2">Carbon tracker</h1>
        <p className="text-gray-500 max-w-2xl">
          Capture transportation, energy, and lifestyle data with scientific precision.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#1b4332] font-headline mb-8">Add a footprint entry</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Category Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue('category', cat.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        selectedCategory === cat.id 
                          ? 'border-[#1b4332] bg-[#1b4332]/5 text-[#1b4332]' 
                          : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-teal-100 hover:bg-white'
                      }`}
                    >
                      <span className="material-symbols-outlined mb-1">{cat.icon}</span>
                      <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.category.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Sub-category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Details (Sub-category)</label>
                  <input
                    {...register('subCategory')}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                    placeholder="e.g. Commute, Solar, Beef"
                  />
                </div>
                {/* Entry Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Entry Date</label>
                  <input
                    type="date"
                    {...register('entryDate')}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.entryDate ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                  />
                  {errors.entryDate && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.entryDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                  <input
                    type="number"
                    step="any"
                    {...register('quantity', { valueAsNumber: true })}
                    className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                      errors.quantity ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.quantity && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.quantity.message}</p>}
                </div>
                {/* Unit */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                  <select
                    {...register('unit')}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none appearance-none"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Emission Factor */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Emission Factor (kg CO₂e per unit)</label>
                <input
                  type="number"
                  step="any"
                  {...register('emissionFactor', { valueAsNumber: true })}
                  className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 text-sm transition-all focus:bg-white focus:outline-none ${
                    errors.emissionFactor ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-[#1b4332]'
                  }`}
                  placeholder="0.00"
                />
                {errors.emissionFactor && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.emissionFactor.message}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                <textarea
                  {...register('notes')}
                  rows="2"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none resize-none"
                  placeholder="Provide context like trip purpose..."
                />
                {errors.notes && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.notes.message}</p>}
              </div>

              <button
                disabled={isSubmitting || createMutation.isLoading}
                type="submit"
                className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {(isSubmitting || createMutation.isLoading) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging entry...</span>
                  </>
                ) : (
                  <>
                    <span>Log entry</span>
                    <span className="material-symbols-outlined">add_task</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* History Column */}
        <div className="lg:col-span-7">
          <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#1b4332] font-headline">Recent entries</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Latest Impact Activities</p>
              </div>
              <div className="flex bg-gray-50 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-[10px] font-bold bg-white text-[#1b4332] rounded shadow-sm">Recent</button>
                <button className="px-4 py-1.5 text-[10px] font-medium text-gray-400 hover:text-gray-600">Archived</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-teal-50 border-t-[#1b4332] rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Retrieving history...</p>
                </div>
              ) : entries.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {entries.map((entry) => (
                    <div key={entry._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#1b4332] group-hover:bg-[#1b4332] group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined">
                            {entry.category?.toLowerCase() === 'transportation' ? 'directions' : 
                             entry.category?.toLowerCase() === 'energy' ? 'bolt' : 
                             entry.category?.toLowerCase() === 'waste' ? 'recycling' : 
                             entry.category?.toLowerCase() === 'food' ? 'restaurant' : 'category'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-bold text-sm text-gray-900 capitalize">{entry.category}</p>
                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
                              {entry.subCategory || 'General'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {dayjs(entry.entryDate).format('MMM D, YYYY')} • {entry.quantity} {entry.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#1b4332]">
                          {(entry.calculatedCO2e || 0).toFixed(2)} <span className="text-[10px] uppercase text-gray-400">kg CO₂e</span>
                        </p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Carbon Footprint</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                    <span className="material-symbols-outlined text-3xl">add_chart</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-[#1b4332]">No records found</p>
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">Start logging your activities to visualize your environmental impact.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination / Footer */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing {entries.length} of 20 results</p>
              <button className="text-[10px] font-bold text-[#1b4332] hover:underline uppercase tracking-widest">View comprehensive logs</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CarbonTrackerPage;
