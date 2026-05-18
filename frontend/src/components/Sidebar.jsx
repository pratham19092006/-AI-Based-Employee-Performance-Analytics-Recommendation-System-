import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, PieChart, BrainCircuit, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
    { name: 'Add Employee', path: '/employees/new', icon: <UserPlus size={20} /> },
    { name: 'AI Hub', path: '/ai', icon: <BrainCircuit size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChart size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shadow-2xl z-20 transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-slate-700/50">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">AI EMP Analytics</h1>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <span className="group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-slate-200 cursor-pointer rounded-xl hover:bg-slate-800 transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
