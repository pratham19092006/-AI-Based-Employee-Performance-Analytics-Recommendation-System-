import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, TrendingUp, Award, BarChart3, Bot, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
      {icon}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, aiRes] = await Promise.all([
          api.get('/employees/analytics/dashboard'),
          api.get('/ai/summary')
        ]);
        setStats(statsRes.data.data);
        setAiSummary(aiRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // Formatting data for charts
  const deptData = stats?.deptStats?.map(d => ({
    name: d._id,
    count: d.count,
    avgScore: Math.round(d.avgScore)
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening with your team today.</p>
        </div>
        <Link to="/employees/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center shadow-sm shadow-indigo-200">
          <Zap size={16} className="mr-2" />
          Add Employee
        </Link>
      </div>

      {/* AI Summary Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Bot size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <Bot size={24} className="text-indigo-200" />
            <h2 className="text-lg font-semibold">AI Executive Summary</h2>
          </div>
          <p className="text-indigo-50 leading-relaxed max-w-4xl text-sm md:text-base">
            {aiSummary || "Generating insights based on recent employee performance..."}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats?.totalEmployees || 0} 
          icon={<Users className="text-blue-500" size={24} />} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Avg. Performance" 
          value={`${Math.round(stats?.avgPerformance || 0)}%`} 
          icon={<TrendingUp className="text-emerald-500" size={24} />} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Departments" 
          value={stats?.deptStats?.length || 0} 
          icon={<BarChart3 className="text-purple-500" size={24} />} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Top Performers" 
          value={stats?.topPerformers?.length || 0} 
          icon={<Award className="text-amber-500" size={24} />} 
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Department Performance</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="avgScore" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Top Performers</h2>
          <div className="space-y-4">
            {stats?.topPerformers?.map((emp, index) => (
              <Link to={`/employees/${emp._id}`} key={emp._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-600' : 
                    index === 1 ? 'bg-slate-100 text-slate-600' : 
                    index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{emp.name}</h4>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium">
                    {emp.performanceScore}/100
                  </span>
                </div>
              </Link>
            ))}
            {(!stats?.topPerformers || stats.topPerformers.length === 0) && (
              <div className="text-center text-slate-500 py-8 text-sm">No employees found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
