import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Home from './Home';
import Login from './Login';
import Doctors from './Doctors';
import DoctorDetail from './DoctorDetail';
import AboutUs from './AboutUs';
import DoctorRegister from './DoctorRegister';
import PatientRegister from './PatientRegister';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AppointmentForm from './AppointmentForm';
import StaffDashboard from './StaffDashboard';
import PatientReports from './PatientReports';
import VideoCall from './VideoCall';
import CreatePrescription from './CreatePrescription';
import PatientPrescriptions from './PatientPrescriptions';
import AdminPanel from './AdminPanel';
import AppointmentSuccess from './AppointmentSuccess';
import AppointmentList from './AppointmentList';
import PatientVideoWaiting from './PatientVideoWaiting';
import ConsultationCategories from './ConsultationCategories';
import ConsultationBookingForm from './ConsultationBookingForm';
import PublicLayout from './PublicLayout';
import Tools from './Tools';
import MedicalDictionary from './MedicalDictionary';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/doctor-register" element={<DoctorRegister />} />
            <Route path="/patients/register" element={<PatientRegister />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/book/:doctorId" element={<AppointmentForm />} />
            <Route path="/appointments/success/:id" element={<AppointmentSuccess />} />
            <Route path="/appointments/:id/call" element={<VideoCall />} />
            <Route path="/doctor/video-call" element={<VideoCall />} />
            <Route path="/consultations" element={<ConsultationCategories />} />
            <Route path="/consultation/book/:specializationId" element={<ConsultationBookingForm />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/dictionary" element={<MedicalDictionary />} />
          </Route>

          <Route path="/patient/dashboard" element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/reports" element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientReports />
            </ProtectedRoute>
          } />
          <Route path="/patient/prescriptions" element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientPrescriptions />
            </ProtectedRoute>
          } />
          <Route path="/patient/video-call-waiting" element={
            <ProtectedRoute requiredRole="PATIENT">
              <PatientVideoWaiting />
            </ProtectedRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute requiredRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/prescription/create" element={
            <ProtectedRoute requiredRole="DOCTOR">
              <CreatePrescription />
            </ProtectedRoute>
          } />
          <Route path="/staff/dashboard" element={
            <ProtectedRoute requiredRole="STAFF">
              <StaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-panel" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
