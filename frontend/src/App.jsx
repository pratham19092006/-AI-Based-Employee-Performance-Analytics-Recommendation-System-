import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetails from './pages/EmployeeDetails';
import Analytics from './pages/Analytics';
import AIRecommendation from './pages/AIRecommendation';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/edit/:id" element={<EmployeeForm />} />
          <Route path="employees/:id" element={<EmployeeDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai" element={<AIRecommendation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
