import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/employees/analytics/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div></div>;
  }

  // Prepare data for charts
  const deptData = stats?.deptStats?.map(d => ({
    name: d._id,
    employees: d.count,
    avgScore: Math.round(d.avgScore)
  })) || [];

  const COLORS = ['#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Deep dive into employee performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Employee Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="employees"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Dept */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Average Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="avgScore" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Performance Trajectory Matrix</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deptData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgScore" name="Avg Score" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="employees" name="Headcount" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
