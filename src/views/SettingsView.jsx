import { useEffect, useState } from 'react';
import { Bell, Building2, Moon, ShieldCheck, TrendingUp } from 'lucide-react';
import { apiUpdate } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';
import { displayName } from '@/utils/format';
import PageHeader from '@/components/PageHeader';

/** Account preferences view; profile changes are sent to PATCH /user/{id}. */
export default function SettingsView() {
  const { user } = useAuth();
  const [name, setName] = useState(displayName(user));
  const [email] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [toggles, setToggles] = useState({ reminders: true, values: true, dark: false, language: true });

  useEffect(() => {
    setName(displayName(user));
  }, [user]);

  async function save(event) {
    event.preventDefault();
    setSaved(false);
    setError('');
    try {
      if (!user?.id) throw new Error('No user id available');
      const result = await apiUpdate(`/user/${user.id}`, { full_name: name });
      const updatedUser = result?.data || result;
      sessionStorage.setItem('treehouse_user', JSON.stringify({ ...user, ...updatedUser, full_name: name }));
      setSaved(true);
    } catch {
      setError('Your profile could not be saved. Please try again.');
    }
  }

  return (
    <>
      <PageHeader eyebrow="ACCOUNT" title="Settings" subtitle="Manage your account and preferences." />
      <section className="content-grid"><div className="section-card"><div className="card-header"><div><p className="eyebrow">PROFILE</p><h2>Personal details</h2></div></div><form className="settings-form" onSubmit={save}><label>Full name<input required value={name} onChange={(e) => setName(e.target.value)} /></label><label>Email<input value={email} disabled /></label><button className="dark-button" type="submit">Save changes</button>{saved && <p className="success-text">Your profile is saved.</p>}{error && <p className="form-error">{error}</p>}</form></div><div className="section-card"><div className="card-header"><div><p className="eyebrow">PREFERENCES</p><h2>Preferences</h2></div></div><div className="settings-toggles">{[['reminders','Payment reminders','Get notified before due dates',Bell],['values','Value updates','Monthly property value reports',TrendingUp],['dark','Dark mode','Use dark theme',Moon],['language','Language','English (Singapore)',Building2]].map(([key, title, detail, Icon]) => <div className="toggle-row" key={key}><div className="toggle-icon"><Icon size={16} /></div><div><strong>{title}</strong><span>{detail}</span></div><button type="button" aria-label={`Toggle ${title}`} className={`toggle-switch ${toggles[key] ? 'on' : ''}`} onClick={() => setToggles({ ...toggles, [key]: !toggles[key] })}><i /></button></div>)}</div></div></section>
      <section className="section-card"><div className="card-header"><div><p className="eyebrow">SECURITY</p><h2>Security</h2></div></div><div className="settings-toggles"><div className="toggle-row"><div className="toggle-icon"><ShieldCheck size={16} /></div><div><strong>Session protection</strong><span>Authenticated requests use bearer tokens.</span></div></div></div></section>
    </>
  );
}
