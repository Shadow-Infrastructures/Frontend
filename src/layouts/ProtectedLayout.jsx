import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Overview from '@/views/Overview';
import Properties from '@/views/Properties';
import PropertyDetail from '@/views/PropertyDetail';
import Loans from '@/views/Loans';
import Refinance from '@/views/Refinance';
import Documents from '@/views/Documents';
import Help from '@/views/Help';
import SettingsView from '@/views/SettingsView';

/** Authenticated shell: responsive sidebar, topbar, and page routes. */
export default function ProtectedLayout() {
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <div className="loading-screen">Loading your owner space...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      <main className="main-content">
        <Topbar user={user} onMenuClick={() => setMobileOpen((open) => !open)} />
        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/refinance" element={<Refinance />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
