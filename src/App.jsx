import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import LoginPage from './pages/dashboards/LoginPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import TelecallerDashboard from './pages/dashboards/TelecallerDashboard';
import StudentDashboard from './pages/dashboards/StudentsDashboard';
import HomePage from './pages/home/HomePage';
import PrivateRoute from './routes/PrivateRoute';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute roles={['Admin']} />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
            <Route element={<PrivateRoute roles={['Manager']} />}>
              <Route path="/manager/*" element={<ManagerDashboard />} />
            </Route>
            <Route element={<PrivateRoute roles={['Telecaller']} />}>
              <Route path="/telecaller/*" element={<TelecallerDashboard />} />
            </Route>
            <Route element={<PrivateRoute roles={['Student']} />}>
              <Route path="/student/*" element={<StudentDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;
