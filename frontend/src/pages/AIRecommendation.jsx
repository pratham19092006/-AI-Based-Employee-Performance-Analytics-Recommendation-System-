import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BrainCircuit, Trophy, BookOpen, MessageSquareText, 
  Loader2, Users, ChevronDown, ChevronUp, Sparkles,
  TrendingUp, AlertCircle, Star, Target
} from 'lucide-react';

// ─── Tab Button ─────────────────────────────
const TabBtn = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
        : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ─── AI Result Card ─────────────────────────
const AiCard = ({ title, color, children }) => (
  <div className={`bg-white rounded-2xl border ${color} shadow-sm p-6`}>
    {children}
  </div>
);

// ─── Main Component ─────────────────────────
const AIRecommendation = () => {
  const [tab, setTab] = useState('recommend');
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Fetch employee list for dropdown
  useEffect(() => {
    api.get('/employees?limit=50').then(res => {
      setEmployees(res.data.data || []);
    }).catch(console.error);
  }, []);

  const runAI = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    try {
      let res;
      if (tab === 'recommend') {
        res = await api.post('/ai/recommend', { employeeId: selectedId });
      } else if (tab === 'feedback') {
        res = await api.post('/ai/feedback', { employeeId: selectedId });
      } else if (tab === 'ranking') {
        res = await api.post('/ai/ranking', {});
      } else if (tab === 'training') {
        res = await api.post('/ai/training', {});
      }
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const needsEmployee = tab === 'recommend' || tab === 'feedback';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 rounded-xl">
          <BrainCircuit className="text-indigo-600" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Intelligence Hub</h1>
          <p className="text-slate-500 text-sm">Powered by OpenRouter · GPT-3.5-Turbo</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-3">
        <TabBtn active={tab==='recommend'} onClick={() => { setTab('recommend'); setResult(null); }} icon={<Sparkles size={16}/>} label="Promotion Analysis" />
        <TabBtn active={tab==='feedback'} onClick={() => { setTab('feedback'); setResult(null); }} icon={<MessageSquareText size={16}/>} label="Performance Feedback" />
        <TabBtn active={tab==='ranking'} onClick={() => { setTab('ranking'); setResult(null); }} icon={<Trophy size={16}/>} label="AI Ranking" />
        <TabBtn active={tab==='training'} onClick={() => { setTab('training'); setResult(null); }} icon={<BookOpen size={16}/>} label="Training Plan" />
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {needsEmployee && (
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-600 mb-2">Select Employee</label>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              >
                <option value="">-- Choose an employee --</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.department}) — Score: {emp.performanceScore}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!needsEmployee && (
            <div className="flex items-center space-x-3 text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 w-full sm:w-auto">
              <Users size={18} />
              <span className="text-sm">Will analyze all {employees.length} employees</span>
            </div>
          )}
          <button
            onClick={runAI}
            disabled={loading || (needsEmployee && !selectedId)}
            className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Analyzing...</> : <><Sparkles size={18} className="mr-2" /> Run AI Analysis</>}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* ── PROMOTION ANALYSIS ── */}
          {tab === 'recommend' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AiCard title="" color="border-emerald-200">
                <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3 flex items-center"><TrendingUp size={14} className="mr-1" /> Strengths</h3>
                <ul className="space-y-1.5">
                  {result.strengths?.map((s, i) => <li key={i} className="text-sm text-slate-700 flex items-start"><span className="text-emerald-500 mr-2 mt-0.5">✓</span>{s}</li>)}
                </ul>
              </AiCard>
              <AiCard title="" color="border-amber-200">
                <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 flex items-center"><AlertCircle size={14} className="mr-1" /> Weaknesses</h3>
                <ul className="space-y-1.5">
                  {result.weaknesses?.map((s, i) => <li key={i} className="text-sm text-slate-700 flex items-start"><span className="text-amber-500 mr-2 mt-0.5">!</span>{s}</li>)}
                </ul>
              </AiCard>
              <AiCard title="" color="border-blue-200">
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center"><BookOpen size={14} className="mr-1" /> Required Training</h3>
                <ul className="space-y-1.5">
                  {result.requiredTraining?.map((s, i) => <li key={i} className="text-sm text-slate-700 flex items-start"><span className="text-blue-500 mr-2 mt-0.5">→</span>{s}</li>)}
                </ul>
              </AiCard>
              <AiCard title="" color="border-purple-200">
                <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2 flex items-center"><Star size={14} className="mr-1" /> Promotion Status</h3>
                <p className="text-slate-800 font-semibold text-sm mb-3">{result.promotionEligibility}</p>
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 flex items-center"><Target size={14} className="mr-1" /> Action Plan</h3>
                <p className="text-slate-600 text-sm">{result.actionPlan}</p>
                {result.salaryBand && <p className="mt-3 text-xs text-slate-500">💰 Salary Band: <span className="font-medium text-slate-700">{result.salaryBand}</span></p>}
              </AiCard>
              <AiCard title="" color="border-slate-200 md:col-span-2">
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Future Growth</h3>
                <p className="text-slate-700 text-sm leading-relaxed italic">"{result.futureGrowthSuggestions}"</p>
              </AiCard>
            </div>
          )}

          {/* ── FEEDBACK ── */}
          {tab === 'feedback' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AiCard color="border-indigo-200 md:col-span-2">
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Performance Summary</h3>
                <p className="text-slate-700 leading-relaxed">{result.performanceSummary}</p>
              </AiCard>
              <AiCard color="border-emerald-200">
                <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Positive Feedback</h3>
                <p className="text-sm text-slate-700">{result.positiveFeedback}</p>
              </AiCard>
              <AiCard color="border-amber-200">
                <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">Constructive Feedback</h3>
                <p className="text-sm text-slate-700">{result.constructiveFeedback}</p>
              </AiCard>
              <AiCard color="border-blue-200">
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">SMART Goals</h3>
                <ul className="space-y-1.5">
                  {result.goalSetting?.map((g, i) => <li key={i} className="text-sm text-slate-700 flex items-start"><span className="text-blue-500 mr-2">{i+1}.</span>{g}</li>)}
                </ul>
              </AiCard>
              <AiCard color="border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Manager's Note</h3>
                <p className="text-sm text-slate-700 italic">"{result.managerNote}"</p>
                <p className="mt-3 text-xs text-slate-400">Next Review: <span className="font-medium text-slate-600">{result.nextReviewDate}</span></p>
              </AiCard>
            </div>
          )}

          {/* ── RANKING ── */}
          {tab === 'ranking' && (
            <div className="space-y-4">
              <AiCard color="border-indigo-200">
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">AI Summary</h3>
                <p className="text-slate-700 text-sm">{result.summary}</p>
              </AiCard>
              <div className="grid grid-cols-1 gap-3">
                {result.rankings?.map((emp, i) => (
                  <div key={i} className={`bg-white border rounded-xl p-4 flex items-center space-x-4 ${i === 0 ? 'border-amber-300 bg-amber-50/30' : i === 1 ? 'border-slate-300 bg-slate-50/30' : i === 2 ? 'border-orange-300 bg-orange-50/30' : 'border-slate-100'}`}>
                    <div className={`text-2xl font-black w-12 h-12 rounded-full flex items-center justify-center ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      #{emp.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-800">{emp.name}</h4>
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{emp.badge}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{emp.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{emp.score}</div>
                      <div className="text-xs text-slate-400">AI Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TRAINING ── */}
          {tab === 'training' && (
            <div className="space-y-4">
              <AiCard color="border-blue-200">
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center"><Users size={14} className="mr-1" /> Team-Wide Training Programs</h3>
                <div className="flex flex-wrap gap-2">
                  {result.teamTrainings?.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100">{t}</span>
                  ))}
                </div>
                {result.budgetEstimate && <p className="mt-4 text-sm text-slate-500">Estimated Budget: <span className="font-semibold text-slate-700">{result.budgetEstimate}</span></p>}
              </AiCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.individualPlans?.map((plan, i) => (
                  <AiCard key={i} color={`border-${plan.priority === 'High' ? 'red' : plan.priority === 'Medium' ? 'amber' : 'emerald'}-200`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-800">{plan.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${plan.priority === 'High' ? 'bg-red-50 text-red-600' : plan.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {plan.priority} Priority
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase mb-1">Courses</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.courses?.map((c, j) => <span key={j} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{c}</span>)}
                        </div>
                      </div>
                      {plan.certifications?.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase mb-1">Certifications</p>
                          <div className="flex flex-wrap gap-1">
                            {plan.certifications?.map((c, j) => <span key={j} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{c}</span>)}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-slate-500">⏱ Duration: <span className="font-medium">{plan.estimatedDuration}</span></p>
                    </div>
                  </AiCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !error && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center py-20 text-center">
          <BrainCircuit size={56} className="text-indigo-200 mb-4" />
          <h3 className="text-slate-700 font-semibold text-lg mb-2">Ready to Analyze</h3>
          <p className="text-slate-400 text-sm max-w-sm">Select a mode above, choose an employee if needed, and click <strong>Run AI Analysis</strong> to get instant insights powered by GPT-3.5.</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;
