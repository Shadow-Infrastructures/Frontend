import { Bell, ChevronRight, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { displayName } from '@/utils/format';

/** Top bar with breadcrumb, mobile menu button, and user initials. */
export default function Topbar({ user, onMenuClick }) {
  const location = useLocation();
  const labels = {
    '/': 'Overview',
    '/properties': 'My properties',
    '/loans': 'Loan tracker',
    '/refinance': 'Refinance',
    '/documents': 'Document vault',
    '/help': 'Help centre',
    '/settings': 'Settings',
  };
  const initials = displayName(user).slice(0, 2).toUpperCase();

  let label = labels[location.pathname];
  if (!label && location.pathname.startsWith('/properties/')) label = 'Property details';

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenuClick} aria-label="Open navigation">
        <Menu size={22} />
      </button>
      <div className="breadcrumb">
        <span>Owner space</span>
        <ChevronRight size={14} />
        <strong>{label || 'Overview'}</strong>
      </div>
      <div className="topbar-actions">
        <button className="icon-button notification-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
        <div className="topbar-avatar">{initials}</div>
      </div>
    </header>
  );
}
