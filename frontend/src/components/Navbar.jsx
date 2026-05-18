import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-slate-500 hover:text-slate-700 transition-colors">
          <Menu size={24} />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search anywhere..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 w-64 outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
            <span className="text-xs text-slate-500 capitalize">{user?.role}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 ml-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
