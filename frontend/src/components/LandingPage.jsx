import React from 'react';
import { Plus, PiggyBank, Car, TrendingUp, ChevronRight, ShieldCheck, Smartphone, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dashboard from "./Dashboard.jsx";
import Navbar from "./Navbar.jsx" 

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      {<Navbar />}
      

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 md:pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
              <TrendingUp size={14} /> NEW: Track MMF Interest Daily
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-8">
              Your goals deserve a <span className="text-emerald-400">roadmap.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              The smartest way to save for a <b>Subaru</b>, a new <b>iPhone</b>, or your next big move. We calculate the math; you just stack the cash.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login" className="px-10 py-5 bg-[#10b981] text-[#020817] rounded-2xl font-bold hover:bg-[#059669] transition-all flex items-center justify-center gap-2 text-lg group shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <button className="px-10 py-5 border border-slate-800 rounded-2xl font-bold hover:bg-white/5 transition-all text-lg">
                How it works
              </button> */}
            </div>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="relative w-full max-w-[540px] mx-auto lg:max-w-none perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[3rem] blur-3xl opacity-30" />
            
            <div className="relative bg-[#0b1221] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden group">
              {/* Fake UI Overlay for Landing Page */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] via-transparent to-transparent z-10 pointer-events-none" />
              
              <div className="flex justify-between items-end mb-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Preview Dashboard</p>
                  <h3 className="text-3xl font-bold text-white tracking-tight">KSh 1,240,000.00</h3>
                </div>
                
              </div>

              {/* Goal Card 1 */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 mb-4 transform group-hover:-translate-y-1 transition-transform duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Car size={24} /></div>
                    <div>
                      <h4 className="font-bold text-white">Car</h4>
                      <p className="text-[10px] text-slate-500 font-mono">2026-08-01 DEADLINE</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full mb-4">
                  <div className="h-full w-[45%] bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Monthly Req.</span>
                  <span className="text-emerald-400 font-bold">KSh 45,500/mo</span>
                </div>
              </div>

              {/* Goal Card 2 - Partial View */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 opacity-40">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Smartphone size={24} /></div>
                  <h4 className="font-bold text-white">iPhone 17 Pro</h4>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Simple Feature Strip */}
      <section className="relative z-10 border-y border-slate-900 bg-[#020817]/50 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <MousePointer2 className="text-emerald-400" />
            <h4 className="text-white font-bold text-lg">Set Goals in Seconds</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Simply name your goal, set a price, and pick a date. We handle the rest of the logic.</p>
          </div>
          <div className="flex flex-col gap-4">
            <TrendingUp className="text-emerald-400" />
            <h4 className="text-white font-bold text-lg">Daily Interest Tracking</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Integrated with MMF logic so you can see how your Ziidi or Stanbic funds grow day by day.</p>
          </div>
          <div className="flex flex-col gap-4">
            <ShieldCheck className="text-emerald-400" />
            <h4 className="text-white font-bold text-lg">Secure & Private</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Your data is yours. We use bank-grade encryption to keep your financial progress private.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-slate-600 text-xs border-t border-slate-900">
        <p className="tracking-widest uppercase">© 2026 Tajirika. Built for the modern saver.</p>
      </footer>
    </div>
  );
};

export default LandingPage;