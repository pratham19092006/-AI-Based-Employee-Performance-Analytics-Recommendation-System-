import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-md w-full glass rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10 relative z-10 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-lg mb-4">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-indigo-200/80 mt-2 text-sm">Sign in to your analytics dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-indigo-200/80 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 w-4 h-4 mr-2" />
              Remember me
            </label>
            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-indigo-200/60">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
