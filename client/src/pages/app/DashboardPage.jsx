import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { dashboardApi } from '../../api/index.js';

/**
 * DashboardPage Component
 * 
 * High-fidelity impact dashboard for Ecotrakify.
 * Refined with the Eco-Modern design system:
 * - Replaces MUI with tailored Tailwind CSS
 * - Integrates Montserrat typography and #1b4332 brand colors
 * - Preserves React Query logic and Recharts integration
 * - Features polished stat cards, momentum charts, and community feeds
 */

const COLORS = ['#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d'];

const StatCardLocal = ({ label, value, helper, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#1b4332]">
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

const DashboardPage = () => {
  const { data, isLoading } = useQuery({ 
    queryKey: ['dashboard'], 
    queryFn: dashboardApi.overview 
  });

  const pieData = Object.entries(data?.breakdown || {}).map(([key, value]) => ({ 
    name: key.charAt(0).toUpperCase() + key.slice(1), 
    value 
  }));

  const averageProgress = data?.goalProgress?.length
    ? Math.round(data.goalProgress.reduce((sum, item) => sum + item.progress, 0) / data.goalProgress.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#f9f9f8] p-8 font-sans text-gray-900">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 text-teal-600 mb-2">
          <span className="material-symbols-outlined text-sm"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sustainability Command Center</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1b4332] font-headline mb-2">Impact Dashboard</h1>
        <p className="text-gray-500 max-w-2xl">
          Monitor your emissions, goals, and inspiration in one glance. Precision data for a greener footprint.
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-teal-100 border-t-[#1b4332] rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing your impact data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCardLocal
              label="Total CO₂e"
              value={`${(data?.totals?.totalCO2e || 0).toFixed(2)} kg`}
              helper="Combined footprint from recent entries"
              icon="Forest"
            />
            <StatCardLocal
              label="Entries logged"
              value={data?.totals?.entries || 0}
              helper="Last 10 activities recorded"
              icon="Timeline"
            />
            <StatCardLocal
              label="Avg goal progress"
              value={`${averageProgress}%`}
              helper="Keep goals above 75% to stay on track"
              icon="Avg_Prg"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emissions Breakdown */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#1b4332] font-headline">Emissions by source</h2>
                <span className="material-symbols-outlined text-gray-300">pie_chart</span>
              </div>
              
              <div className="h-[300px] w-full flex items-center justify-center">
                {pieData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={100} 
                        paddingAngle={5}
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        formatter={(value) => [`${value.toFixed(2)} kg CO₂e`, 'Emissions']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <span className="material-symbols-outlined text-3xl">add_chart</span>
                    </div>
                    <p className="text-sm text-gray-400">Add entries to see your breakdown.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Goal Momentum */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#1b4332] font-headline">Goal momentum</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Trends
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                {data?.goalProgress?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.goalProgress}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1b4332' }}
                        formatter={(value) => [`${value}%`, 'Progress']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="progress" 
                        stroke="#1b4332" 
                        strokeWidth={4} 
                        dot={{ fill: '#1b4332', strokeWidth: 2, r: 4, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-sm text-gray-400 max-w-[200px] mx-auto">
                      Create a sustainability goal to visualize your progress over time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* List Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Entries */}
            <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1b4332] font-headline">Recent entries</h2>
                <button className="text-xs font-bold text-teal-600 hover:underline uppercase tracking-widest">View All</button>
              </div>
              <div className="divide-y divide-gray-50">
                {data?.recentEntries?.length ? (
                  data.recentEntries.map((entry) => (
                    <div key={entry._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#1b4332]">
                          <span className="material-symbols-outlined text-xl">
                            {entry.category?.toLowerCase() === 'transport' ? 'directions_bus' : 
                             entry.category?.toLowerCase() === 'food' ? 'restaurant' : 'bolt'}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            {entry.category} • <span className="text-[#1b4332]">{(entry.calculatedCO2e || 0).toFixed(2)} kg CO₂e</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(entry.entryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-teal-50 text-[#1b4332] text-[10px] font-bold uppercase tracking-wider">
                        {entry.subCategory || 'General'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-sm text-gray-400 italic">
                    No entries yet. Start tracking your impact today.
                  </div>
                )}
              </div>
            </section>

            {/* Community Tips */}
            <section className="bg-[#0b2b1e] rounded-[32px] text-white shadow-xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-900/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="p-8 border-b border-white/5 relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-400">tips_and_updates</span>
                <h2 className="text-xl font-bold font-headline">Featured community tips</h2>
              </div>
              
              <div className="divide-y divide-white/5 relative z-10">
                {data?.featuredTips?.length ? (
                  data.featuredTips.map((tip) => (
                    <div key={tip._id} className="p-8 hover:bg-white/5 transition-colors group cursor-pointer">
                      <h3 className="font-bold text-lg text-teal-400 mb-2 group-hover:translate-x-1 transition-transform">{tip.title}</h3>
                      <p className="text-sm text-emerald-50/70 leading-relaxed line-clamp-2">{tip.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-sm text-emerald-100/40 italic">Share your first tip to inspire the community.</p>
                    <button className="mt-4 px-6 py-2 border border-emerald-100/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                      Contribute a Tip
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
