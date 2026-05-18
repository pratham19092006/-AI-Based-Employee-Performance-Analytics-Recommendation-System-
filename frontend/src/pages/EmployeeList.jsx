import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Edit, Eye, Trash2, Download } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let url = `/employees?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (departmentFilter) url += `&department=${departmentFilter}`;
      
      const res = await api.get(url);
      setEmployees(res.data.data);
      setTotalPages(Math.ceil(res.data.total / 10));
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, departmentFilter, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Product'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[80vh] flex flex-col">
      {/* Header Actions */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view your team members</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button className="hidden md:flex items-center px-4 py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium">
            <Download size={16} className="mr-2" />
            Export PDF
          </button>
          <Link to="/employees/new" className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 text-sm font-medium">
            <Plus size={18} className="mr-2" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, skills..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm text-slate-600 cursor-pointer"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">Performance</th>
                <th className="px-6 py-4 font-semibold hidden lg:table-cell">Experience</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No employees found matching your criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${emp.performanceScore >= 80 ? 'bg-emerald-500' : emp.performanceScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${emp.performanceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{emp.performanceScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-600">
                      {emp.experience} yrs
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/employees/${emp._id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                          <Eye size={18} />
                        </Link>
                        <Link to={`/employees/edit/${emp._id}`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(emp._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
