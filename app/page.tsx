'use client';

import Link from 'next/link';
import { AuthButton } from '@/components/AuthButton';
import { useAuth } from '@/components/FirebaseProvider';
import { motion } from 'motion/react';
import { ArrowRight, Bot, BarChart3, Zap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Bot className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">EdTech<span className="text-indigo-600">Funnel</span></span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
            {user && (
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
            )}
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} />
              <span>AI-Powered Admissions</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
              Qualify student leads <span className="text-indigo-600">instantly</span> with AI.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
              Automate your admission funnel from first query to final conversion. AI-driven scoring, scholarship calculation, and instant call triggers.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/chat" 
                className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1"
              >
                Start AI Chat
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/dashboard" 
                className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Bot className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <div className="h-4 w-32 bg-slate-100 rounded-full mb-2"></div>
                      <div className="h-3 w-24 bg-slate-50 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-50 rounded-full"></div>
                    <div className="h-4 w-5/6 bg-slate-50 rounded-full"></div>
                    <div className="h-4 w-4/6 bg-slate-50 rounded-full"></div>
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Score</div>
                      <div className="text-4xl font-bold text-indigo-600">92%</div>
                    </div>
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">Hot Lead</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce duration-[3000ms]">
              <Zap className="text-white" size={48} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Built for modern education teams.</h2>
            <p className="text-lg text-slate-600">Everything you need to scale your student intake without increasing your team size.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Bot, title: "AI Qualification", desc: "Our AI extracts intent, budget, and timeline from natural conversations." },
              { icon: BarChart3, title: "Lead Scoring", desc: "Automatically categorize leads into Cold, Warm, or Hot based on custom rules." },
              { icon: Zap, title: "Instant Call Triggers", desc: "Connect hot leads with counselors instantly via automated call triggers." },
              { icon: ShieldCheck, title: "Scholarship Engine", desc: "Calculate eligibility dynamically based on academic performance." },
              { icon: BarChart3, title: "Real-time Analytics", desc: "Track conversion rates and funnel performance in real-time." },
              { icon: Bot, title: "Multichannel", desc: "Integrate with WhatsApp, Email, and SMS for automated follow-ups." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                  <feature.icon className="text-indigo-600" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Bot className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">EdTechFunnel</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 EdTech Admission Funnel AI System. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
