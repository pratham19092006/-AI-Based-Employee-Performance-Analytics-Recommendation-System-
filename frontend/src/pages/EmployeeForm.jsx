import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, User, Briefcase, Award, Star } from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    skills: '',
    performanceScore: 50,
    experience: 0
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Product'];

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          const res = await api.get(`/employees/${id}`);
          const emp = res.data.data;
          setFormData({
            ...emp,
            skills: emp.skills.join(', ')
          });
        } catch (err) {
          setError('Failed to fetch employee details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };

      if (isEditMode) {
        await api.put(`/employees/${id}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/employees" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
          <p className="text-slate-500 text-sm">{isEditMode ? 'Update employee information and metrics' : 'Register a new team member to the system'}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 border-b border-red-100 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
              <User size={16} className="mr-2 text-indigo-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Professional Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
              <Briefcase size={16} className="mr-2 text-indigo-500" />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm cursor-pointer"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                  placeholder="React, Node.js, Python..."
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Performance Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
              <Award size={16} className="mr-2 text-indigo-500" />
              Performance Metrics
            </h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Overall Score</label>
                <span className="text-lg font-bold text-indigo-600">{formData.performanceScore}/100</span>
              </div>
              <input
                type="range"
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Needs Improvement</span>
                <span>Meets Expectations</span>
                <span>Outstanding</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Link to="/employees" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center text-sm font-medium shadow-sm shadow-indigo-200"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
