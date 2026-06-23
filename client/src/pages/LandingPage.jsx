import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * LandingPage Component
 * 
 * High-fidelity landing page for Ecotrakify.
 * Features a hero section with primary actions, benefit highlights,
 * and integration with the Eco-Modern design system.
 */

const TopNavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#1b4332] font-headline font-bold text-2xl">
          <span className="material-symbols-outlined text-3xl"></span>
          Ecotrakify
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold text-gray-600 hover:text-[#1b4332] transition-colors">Features</a>
          <a href="#impact" className="text-sm font-bold text-gray-600 hover:text-[#1b4332] transition-colors">Impact</a>
          <a href="#pricing" className="text-sm font-bold text-gray-600 hover:text-[#1b4332] transition-colors">Pricing</a>
          <RouterLink to="/auth/login" className="text-sm font-bold text-gray-600 hover:text-[#1b4332] transition-colors">Login</RouterLink>
          <RouterLink to="/auth/register" className="bg-[#1b4332] text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-sm">
            Start Tracking
          </RouterLink>
        </div>
      </div>
    </nav>
  );
};

const HighlightItem = ({ title, subtitle, icon }) => (
  <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="w-12 h-12 shrink-0 rounded-lg bg-teal-50 flex items-center justify-center text-[#1b4332]">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <h3 className="font-bold text-lg text-[#1b4332] mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const highlights = [
    { title: 'Track smarter', subtitle: 'Log transport, energy, waste & more with guided emission factors.', icon: 'analytics' },
    { title: 'Set focused goals', subtitle: 'Build realistic targets with proactive reminders and progress tracking.', icon: 'target' },
    { title: 'Grow together', subtitle: 'Learn from real community tips vetted for quality and environmental impact.', icon: 'group' }
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f8] font-sans text-gray-900 selection:bg-teal-100 selection:text-[#1b4332]">
      <TopNavBar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Eco-first productivity
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-[#1b4332] font-headline leading-[1.1] mb-6">
                Understand. Reduce. <span className="text-teal-600 italic font-medium">Celebrate</span> your carbon impact.
              </h1>
              
              <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mb-10">
                Ecotrakify brings advanced carbon insights, human coaching cues, and business-ready analytics into a single intuitive experience built for the modern world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <RouterLink 
                  to="/auth/register" 
                  className="bg-[#1b4332] text-white px-8 py-4 rounded-xl font-bold text-lg text-center hover:shadow-lg hover:shadow-teal-900/10 transition-all active:scale-95"
                >
                  Create free account
                </RouterLink>
                <RouterLink 
                  to="/auth/login" 
                  className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-gray-50 transition-all active:scale-95"
                >
                  I already have an account
                </RouterLink>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-6 pt-8 border-t border-gray-100 opacity-60 grayscale hover:grayscale-0 transition-all">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trusted by teams at</p>
                <div className="flex gap-8 items-center">
                  <span className="font-headline font-bold text-lg tracking-tighter">GREENCO</span>
                  <span className="font-headline font-bold text-lg tracking-tighter">ECOCORE</span>
                  <span className="font-headline font-bold text-lg tracking-tighter">PLANET+</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Background Decoration */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#1b4332]/10 rounded-full blur-3xl opacity-50 -z-10"></div>

                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold text-[#1b4332] font-headline">Why teams choose Ecotrakify</h2>
                    <span className="material-symbols-outlined text-teal-500">verified</span>
                  </div>
                  
                  <div className="space-y-6">
                    {highlights.map((item, index) => (
                      <HighlightItem key={index} {...item} />
                    ))}
                  </div>

                  <div className="mt-10 p-6 bg-[#0b2b1e] rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Current Global Impact</p>
                      <p className="text-3xl font-headline font-bold mb-1">1.2M Tons CO₂</p>
                      <p className="text-xs opacity-70">Saved by our community this year.</p>
                    </div>
                    <div className="absolute top-0 right-0 opacity-10 translate-x-4 -translate-y-4">
                      <span className="material-symbols-outlined text-8xl"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="py-20 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-[#1b4332] font-headline font-bold text-xl mb-6">
              <span className="material-symbols-outlined"></span>
              Ecotrakify
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              Leading the transition to a carbon-conscious world through precise data, community action, and intelligent insights.
            </p>
            <div className="flex gap-4">
              {/* {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#1b4332] hover:bg-teal-50 transition-all">
                  <span className="material-symbols-outlined text-lg">{social}</span>
                </a>
              ))} */}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#1b4332] mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Carbon Calculator</a></li>
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#1b4332] mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#1b4332] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          <p>© 2024 Ecotrakify Inc. All rights reserved.</p>
          <p>Built for a greener future</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
