import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Building2, Home, Landmark, Plus, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { displayName, formatMoney } from '@/utils/format';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import PropertyRow from '@/components/PropertyRow';

/** Dashboard overview populated entirely from backend collections. */
export default function Overview() {
  const { user } = useAuth();
  const { properties, loans, loading, error } = useDashboardData();
  const navigate = useNavigate();
  const totalValue = properties.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const outstanding = loans.reduce((sum, item) => sum + Number(item.balance || 0), 0);
  const monthly = loans.reduce((sum, item) => sum + Number(item.monthly || 0), 0);
  const nextDue = loans[0]?.nextDue || 'No payment data';
  const dateLabel = new Intl.DateTimeFormat('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  if (loading) return <div className="loading-state">Loading your portfolio...</div>;

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">{dateLabel.toUpperCase()}</p>
          <h1>Good morning, {displayName(user)}<span className="title-dot">.</span></h1>
          <p className="subtitle">A clearer view of your home and financial future.</p>
        </div>
      </section>
      {error && <div className="error-banner">We could not load every account detail. Please refresh and try again.</div>}
      <section className="stat-grid">
        <StatCard tone="dark" label="Total property value" value={formatMoney(totalValue)} foot={<span>{properties.length} {properties.length === 1 ? 'property' : 'properties'} connected</span>} icon={Building2} />
        <StatCard label="Outstanding loans" value={formatMoney(outstanding)} foot={<span>Across {loans.length} loans</span>} icon={Landmark} />
        <StatCard label="Next payment" value={formatMoney(monthly)} foot={<span>Due {nextDue}</span>} icon={WalletCards} />
      </section>
      <section className="content-grid">
        <div className="section-card">
          <div className="card-header">
            <div><p className="eyebrow">YOUR PORTFOLIO</p><h2>Properties</h2></div>
            <button className="text-button" onClick={() => navigate('/properties')}><Plus size={16} /> Add property</button>
          </div>
          {properties.length ? (
            <div className="property-list">{properties.map((property) => <PropertyRow key={property.id} property={property} onClick={() => navigate('/properties')} />)}</div>
          ) : (
            <div className="empty-state"><Building2 size={22} /><p>No properties connected yet.</p><button className="dark-button" onClick={() => navigate('/properties')}><Plus size={15} /> Add your first property</button></div>
          )}
          {properties.length > 0 && <button className="view-all" onClick={() => navigate('/properties')}>View all properties <ArrowUpRight size={15} /></button>}
        </div>
        <div className="section-card insight-card">
          <div className="insight-top"><div className="insight-icon"><Sparkles size={18} /></div><span>COMING SOON</span></div>
          <h2>Refinance insights are<br /><em>on the way</em>.</h2>
          <p>We are preparing tailored refinancing guidance for your connected properties.</p>
          <div className="insight-footer"><TrendingUp size={15} /> No refinance applications are available yet</div>
        </div>
      </section>
      <section className="bottom-grid">
        <div className="section-card chart-card">
          <PageHeader eyebrow="PORTFOLIO SNAPSHOT" title="Your current position" subtitle="Live totals from your connected properties and loans." />
          <div className="portfolio-snapshot">
            <div><Home size={18} /><span>Properties</span><strong>{properties.length}</strong></div>
            <div><Landmark size={18} /><span>Loans</span><strong>{loans.length}</strong></div>
            <div><WalletCards size={18} /><span>Monthly commitments</span><strong>{formatMoney(monthly)}</strong></div>
          </div>
        </div>
        <div className="section-card activity-card">
          <div className="card-header"><div><p className="eyebrow">ACCOUNT STATUS</p><h2>Connected data</h2></div></div>
          <div className="connected-status"><span className="status-dot" /><div><strong>Backend connected</strong><span>Your latest portfolio data is shown above.</span></div></div>
        </div>
      </section>
    </>
  );
}
