import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 w-full transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
