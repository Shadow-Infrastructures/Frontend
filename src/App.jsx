import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import AuthScreen from '@/views/AuthScreen';
import ProtectedLayout from '@/layouts/ProtectedLayout';

/** Application entry point: public auth route plus protected owner-space routes. */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/*" element={<ProtectedLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
