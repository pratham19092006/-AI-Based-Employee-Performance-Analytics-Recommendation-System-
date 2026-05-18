import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Bot, Sparkles, BrainCircuit, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const generateAIInsights = async () => {
    setAiLoading(true);
    try {
      const res = await api.post('/ai/recommend', { employeeId: id });
      setAiData(res.data.data);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      alert('Failed to generate AI insights.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div></div>;
  }

  if (!employee) {
    return <div className="text-center py-12 text-slate-500">Employee not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/employees" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Employee Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
            <div className="relative mt-8">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                  {employee.name.charAt(0)}
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-800">{employee.name}</h2>
              <p className="text-slate-500 text-sm">{employee.email}</p>
              
              <div className="mt-6 flex justify-center space-x-4">
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dept</p>
                  <p className="font-semibold text-slate-700">{employee.department}</p>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Exp</p>
                  <p className="font-semibold text-slate-700">{employee.experience} yrs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Performance Score</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className={employee.performanceScore >= 80 ? 'text-emerald-500' : employee.performanceScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                    strokeDasharray={`${employee.performanceScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-slate-800">{employee.performanceScore}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">/ 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden h-full min-h-[400px]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-600 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-cyan-600 blur-3xl opacity-20"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Sparkles className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Analyst Report</h2>
                    <p className="text-indigo-200 text-sm">Powered by GPT-3.5</p>
                  </div>
                </div>
                
                {!aiData && (
                  <button
                    onClick={generateAIInsights}
                    disabled={aiLoading}
                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all text-sm font-medium backdrop-blur-sm"
                  >
                    {aiLoading ? (
                      <span className="flex items-center"><div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div> Analyzing...</span>
                    ) : (
                      <span className="flex items-center"><BrainCircuit className="mr-2" size={16} /> Generate Insights</span>
                    )}
                  </button>
                )}
              </div>

              {aiData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {/* JSON response parsing */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                    <h3 className="text-emerald-400 font-semibold mb-3 flex items-center text-sm uppercase tracking-wider"><TrendingUp size={16} className="mr-2" /> Strengths</h3>
                    <ul className="space-y-2">
                      {aiData.strengths?.map((item, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start"><span className="text-emerald-500 mr-2">•</span>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                    <h3 className="text-amber-400 font-semibold mb-3 flex items-center text-sm uppercase tracking-wider"><AlertCircle size={16} className="mr-2" /> Areas for Growth</h3>
                    <ul className="space-y-2">
                      {aiData.weaknesses?.map((item, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start"><span className="text-amber-500 mr-2">•</span>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                    <h3 className="text-cyan-400 font-semibold mb-3 flex items-center text-sm uppercase tracking-wider"><BookOpen size={16} className="mr-2" /> Required Training</h3>
                    <ul className="space-y-2">
                      {aiData.requiredTraining?.map((item, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start"><span className="text-cyan-500 mr-2">•</span>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-col justify-center">
                    <h3 className="text-purple-400 font-semibold mb-2 text-sm uppercase tracking-wider">Promotion Eligibility</h3>
                    <p className="text-white font-medium text-lg mb-4">{aiData.promotionEligibility}</p>
                    
                    <h3 className="text-indigo-300 font-semibold mb-2 text-sm uppercase tracking-wider">Future Trajectory</h3>
                    <p className="text-slate-300 text-sm italic">"{aiData.futureGrowthSuggestions}"</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                  <Bot size={64} className="text-indigo-400 mb-4 opacity-50" />
                  <p className="text-indigo-200 max-w-md">
                    Click 'Generate Insights' to run an AI analysis on {employee.name}'s performance data, skills, and experience to get actionable recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
