import { Activity, Building2, CircleHelp, FileText, LogOut, Settings, TrendingUp, WalletCards } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { displayName } from '@/utils/format';

const navigation = [
  { label: 'Overview', path: '/', icon: Activity },
  { label: 'My properties', path: '/properties', icon: Building2 },
  { label: 'Loan tracker', path: '/loans', icon: WalletCards },
  { label: 'Refinance', path: '/refinance', icon: TrendingUp },
  { label: 'Document vault', path: '/documents', icon: FileText },
];

/** Sidebar navigation for authenticated screens. */
export default function Sidebar({ user, onLogout, mobileOpen, onNavigate }) {
  const location = useLocation();
  const initials = displayName(user).slice(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand-lockup">
        <img src="/logo/Transparent/TreeHouse_2.svg" alt="TreeHouse" />
      </div>
      <div className="workspace-label">OWNER SPACE</div>
      <nav className="main-nav">
        {navigation.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            to={path}
            onClick={onNavigate}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-divider" />
      <div className="workspace-label">SUPPORT</div>
      <Link className={`nav-item ${location.pathname === '/help' ? 'active' : ''}`} to="/help" onClick={onNavigate}>
        <CircleHelp size={18} />
        <span>Help centre</span>
      </Link>
      <Link className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`} to="/settings" onClick={onNavigate}>
        <Settings size={18} />
        <span>Settings</span>
      </Link>
      <div className="sidebar-bottom">
        <div className="profile-row">
          <div className="avatar">{initials}</div>
          <div className="profile-copy">
            <strong>{displayName(user)}</strong>
            <span>Property owner</span>
          </div>
          <button className="logout-button" onClick={onLogout} aria-label="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
