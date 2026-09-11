import { useEffect, useState } from 'react';
import { ArrowUpRight, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/** Login and registration screen backed by the TreeHouse auth API. */
export default function AuthScreen() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          phone_number: form.phone,
        });
      }
    } catch (err) {
      console.log(err);
      setError('We could not complete that request. Check your details and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <img src="/logo/Stacked/TreeHouse_4.svg" alt="TreeHouse"/>
        <div>
          <p className="eyebrow">HOMEOWNERS, MADE CLEAR</p>
          <h1>Your home is more than an address.</h1>
          <p>Understand your property, your loan and your next smart move in one calm space.</p>
        </div>
        <div className="auth-proof">
          <ShieldCheck size={18} />
          <span>Private by design. Built for Singapore homeowners.</span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo"><img src="/logo/Transparent/TreeHouse_3.svg" alt="TreeHouse" /></div>
          <p className="eyebrow">OWNER SPACE</p>
          <h2>{mode === 'login' ? 'Welcome back.' : 'Create your space.'}</h2>
          <p className="auth-copy">{mode === 'login' ? 'Sign in to see your complete home picture.' : 'Start bringing your property finances into focus.'}</p>
          <form onSubmit={submit}>
            {mode === 'register' && (
              <>
                <label>Full name<input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jamie Lim" /></label>
                <label>Phone number<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+65 9123 4567" /></label>
              </>
            )}
            <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
            {error && <p className="form-error">{error}</p>}
            <button className="dark-button full-button" disabled={busy}>
              {busy && <LoaderCircle className="spin" size={16} />}
              {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowUpRight size={16} />
            </button>
          </form>
          <button className="switch-auth" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'New to TreeHouse? Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </section>
    </main>
  );
}
