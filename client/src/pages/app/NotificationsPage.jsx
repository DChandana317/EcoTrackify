import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { notificationApi } from '../../api/index.js';

dayjs.extend(relativeTime);

/**
 * NotificationsPage Component
 * 
 * High-fidelity notification management for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS primitives
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic, Zod validation, and smart reminder logic
 * - Features high-impact preference toggles and a clear notification feed
 */

const schema = z.object({
  reminders: z.boolean(),
  tipsDigest: z.boolean(),
  quietHoursStart: z.number().min(0).max(23),
  quietHoursEnd: z.number().min(0).max(23)
});

const NotificationsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: notificationApi.list });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { reminders: true, tipsDigest: true, quietHoursStart: 22, quietHoursEnd: 7 }
  });

  const updatePrefs = useMutation({
    mutationFn: notificationApi.updatePrefs,
    onSuccess: (prefs) => {
      enqueueSnackbar('Notification preferences saved', { variant: 'success' });
      setValue('reminders', prefs.reminders);
      setValue('tipsDigest', prefs.tipsDigest);
      setValue('quietHoursStart', prefs.quietHoursStart);
      setValue('quietHoursEnd', prefs.quietHoursEnd);
    },
    onError: () => enqueueSnackbar('Unable to update preferences', { variant: 'error' })
  });

  const markRead = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const onSubmit = (values) => {
    updatePrefs.mutate(values);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-teal-600 mb-2">
          <span className="material-symbols-outlined text-sm">Active</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Notification Center</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2">Notifications & reminders</h1>
        <p className="text-gray-500 max-w-2xl">
          Customize smart nudges. We respect quiet hours and never spam your inbox.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Preferences Column */}
        <div className="lg:col-span-5">
          <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#1b4332] font-headline mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-500">settings_suggest</span>
              Communication Preferences
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
              <div className="space-y-6">
                {/* Reminders Toggle */}
                <Controller
                  name="reminders"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-[#1b4332]/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-[#1b4332]">
                          <span className="material-symbols-outlined">alarm</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Goal reminders</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Smart nudges to stay on track</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={field.value} 
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1b4332]"></div>
                      </div>
                    </label>
                  )}
                />

                {/* Tips Digest Toggle */}
                <Controller
                  name="tipsDigest"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-[#1b4332]/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-[#1b4332]">
                          <span className="material-symbols-outlined">auto</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Weekly eco tips</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Curated sustainable practices</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={field.value} 
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1b4332]"></div>
                      </div>
                    </label>
                  )}
                />
              </div>

              {/* Quiet Hours Section */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-gray-400 text-sm">bedtime</span>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Quiet Hours (24h)</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Starts at</label>
                    <input
                      type="number"
                      {...register('quietHoursStart', { valueAsNumber: true })}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                      min="0"
                      max="23"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ends at</label>
                    <input
                      type="number"
                      {...register('quietHoursEnd', { valueAsNumber: true })}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-4 text-sm focus:bg-white focus:border-[#1b4332] transition-all focus:outline-none"
                      min="0"
                      max="23"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 ml-1 font-medium italic">Notifications will be paused between these hours.</p>
              </div>

              <button
                disabled={isSubmitting || updatePrefs.isLoading}
                type="submit"
                className="w-full bg-[#1b4332] text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal-900/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {(isSubmitting || updatePrefs.isLoading) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Save preferences</span>
                    <span className="material-symbols-outlined">save</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Notifications Column */}
        <div className="lg:col-span-7">
          <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#1b4332] font-headline">Recent notifications</h2>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Inbox Activity</p>
              </div>
              {data?.length > 0 && (
                <button className="text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-widest">Mark all read</button>
              )}
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="p-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-teal-50 border-t-[#1b4332] rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Syncing notifications...</p>
                </div>
              ) : data?.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {data.map((notification) => (
                    <div key={notification._id} className={`p-8 flex items-start justify-between gap-6 transition-colors group ${!notification.isRead ? 'bg-[#1b4332]/[0.02]' : 'hover:bg-gray-50/50'}`}>
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${!notification.isRead ? 'bg-[#1b4332] text-white shadow-lg shadow-teal-900/20' : 'bg-gray-50 text-gray-400 group-hover:bg-[#1b4332]/10 group-hover:text-[#1b4332]'}`}>
                          <span className="material-symbols-outlined">
                            {notification.type === 'goal' ? 'track_changes' : notification.type === 'tip' ? 'lightbulb' : 'notifications'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-bold text-sm ${!notification.isRead ? 'text-[#1b4332]' : 'text-gray-900'}`}>{notification.title}</h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed mb-2">{notification.message}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {dayjs(notification.sentAt).fromNow()}
                          </p>
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => markRead.mutate(notification._id)}
                          disabled={markRead.isLoading}
                          className="px-4 py-1.5 rounded-lg border-2 border-[#1b4332]/10 text-[10px] font-bold text-[#1b4332] uppercase tracking-widest hover:bg-[#1b4332] hover:text-white hover:border-[#1b4332] transition-all shrink-0"
                        >
                          {markRead.isLoading ? '...' : 'Mark read'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center space-y-4 h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                    <span className="material-symbols-outlined text-4xl">notifications_off</span>
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="font-bold text-[#1b4332]">Your inbox is clear</p>
                    <p className="text-xs text-gray-400 max-w-[240px] mx-auto leading-relaxed">
                      You're all caught up. We'll nudge you when it's time to track or when a new tip is ready.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Meta */}
            <div className="p-6 bg-[#0b2b1e] text-white relative overflow-hidden flex items-center justify-between">
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-400">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Impact Vetting</p>
                  <p className="text-xs font-medium">Notifications are vetted for scientific accuracy.</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 opacity-[0.05] translate-x-4 -translate-y-4">
                <span className="material-symbols-outlined text-8xl">notifications</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
