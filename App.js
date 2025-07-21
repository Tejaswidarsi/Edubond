import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplyForm from './pages/ApplyForm';
import ProtectedRoute from './components/ProtectedRoute';
import TrackStatus from './pages/TrackStatus';
import Login from './pages/LoginPage';
import StudentDashboard from './pages/student-dashboard';
import Register from './pages/RegisterPage';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SponsorRegister from './pages/SponsorRegister';
import SponsorLogin from './pages/SponsorLogin';
import SponsorDashboard from './pages/SponsorDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
       <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/track/:requestId" element={<TrackStatus />} />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <ApplyForm />
            </ProtectedRoute>
          } />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/sponsor-register" element={<SponsorRegister/>} />
           <Route path="/sponsor-login" element={<SponsorLogin/>} />
           <Route path="/sponsor-dashboard" element={<SponsorDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
