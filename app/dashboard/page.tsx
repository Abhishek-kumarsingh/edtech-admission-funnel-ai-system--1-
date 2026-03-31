'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/FirebaseProvider';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Filter, 
  Search, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'leads'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      if (error.code === 'cancelled') {
        console.warn("Firestore listener cancelled (idle stream). This is usually benign.");
      } else {
        console.error("Dashboard Firestore Error:", error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-8">
          <Bot className="text-indigo-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-8 max-w-md">Please sign in to view the admission funnel dashboard and manage your leads.</p>
        <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Go to Home</Link>
      </div>
    );
  }

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.category === 'Hot').length,
    warm: leads.filter(l => l.category === 'Warm').length,
    cold: leads.filter(l => l.category === 'Cold').length,
    converted: leads.filter(l => l.status === 'Converted').length
  };

  const chartData = [
    { name: 'Hot', value: stats.hot, color: '#4F46E5' },
    { name: 'Warm', value: stats.warm, color: '#818CF8' },
    { name: 'Cold', value: stats.cold, color: '#C7D2FE' }
  ];

  const filteredLeads = filter === 'All' ? leads : leads.filter(l => l.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 hidden lg:flex flex-col gap-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Bot className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">EdTech<span className="text-indigo-600">Funnel</span></span>
        </Link>

        <nav className="flex flex-col gap-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</div>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm">
            <BarChart className="size-5" />
            Dashboard
          </Link>
          <Link href="/chat" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors">
            <Users className="size-5" />
            Leads
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors">
            <Zap className="size-5" />
            Workflows
          </Link>
        </nav>

        <div className="mt-auto p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
            <h4 className="font-bold mb-2">Need help?</h4>
            <p className="text-xs text-indigo-100 mb-4 opacity-80">Check our documentation for advanced automation.</p>
            <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">Read Docs</button>
          </div>
          <Zap className="absolute -bottom-4 -right-4 text-indigo-500 opacity-20" size={100} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admission Funnel</h1>
            <p className="text-slate-500">Real-time overview of your student lead pipeline.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search leads..." className="bg-transparent outline-none text-sm w-48" />
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              Export CSV
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: "Total Leads", value: stats.total, icon: Users, color: "bg-indigo-50 text-indigo-600", trend: "+12%", up: true },
            { label: "Hot Leads", value: stats.hot, icon: Zap, color: "bg-orange-50 text-orange-600", trend: "+5%", up: true },
            { label: "Warm Leads", value: stats.warm, icon: TrendingUp, color: "bg-blue-50 text-blue-600", trend: "-2%", up: false },
            { label: "Conversion Rate", value: stats.total > 0 ? `${Math.round((stats.converted / stats.total) * 100)}%` : "0%", icon: Zap, color: "bg-green-50 text-green-600", trend: "+8%", up: true }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold">Lead Distribution</h3>
              <div className="flex gap-2">
                {['All', 'Hot', 'Warm', 'Cold'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-8 w-full">Funnel Health</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              {chartData.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 flex justify-between items-center border-b border-slate-50">
            <h3 className="text-xl font-bold">Recent Leads</h3>
            <button className="text-indigo-600 font-bold text-sm flex items-center gap-2 hover:underline">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                          {lead.userId.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm font-bold text-slate-900">Student #{lead.userId.substring(0, 5)}</div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="text-sm text-slate-600">{lead.interest || 'N/A'}</div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lead.category === 'Hot' ? 'bg-orange-100 text-orange-600' :
                        lead.category === 'Warm' ? 'bg-blue-100 text-blue-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {lead.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="text-sm font-bold text-slate-900">{lead.score}</div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          lead.status === 'Converted' ? 'bg-green-500' :
                          lead.status === 'New' ? 'bg-indigo-500' :
                          'bg-slate-300'
                        }`}></div>
                        <span className="text-sm text-slate-600 font-medium">{lead.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="text-xs text-slate-400 font-medium">{lead.createdAt ? format(new Date(lead.createdAt), 'MMM d, yyyy') : 'N/A'}</div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-10 py-20 text-center text-slate-400 font-medium">No leads found matching the criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
