import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Building2, Home, Landmark, Plus, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { displayName, formatMoney } from '@/utils/format';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import PropertyRow from '@/components/PropertyRow';
import ValuationChart from '@/components/ValuationChart';

/** Dashboard overview populated entirely from backend collections. */
export default function Overview() {
  const { user } = useAuth();
  const { properties, loans, propertyDetails, loading, error } = useDashboardData();
  const navigate = useNavigate();
  const totalValue = properties.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const outstanding = loans.reduce((sum, item) => sum + Number(item.balance || 0), 0);
  const monthly = loans.reduce((sum, item) => sum + Number(item.monthly || 0), 0);
  const nextDue = loans[0]?.nextDue || 'No payment data';
  const dateLabel = new Intl.DateTimeFormat('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const portfolioChart = useMemo(() => {
    const allTrends = propertyDetails
      .map((p) => p?.live_tracking?.valuation_analytics?.valuation_trend || [])
      .filter((t) => t && t.length > 0);

    if (allTrends.length === 0) return { data: [], totalValue: 0, changeLabel: '', changePositive: true };

    const dateMap = new Map();
    allTrends.forEach((trend) => {
      trend.forEach((point) => {
        const date = point.date;
        const val = Number(point.valuation_sgd || point.valuation || 0);
        dateMap.set(date, (dateMap.get(date) || 0) + val);
      });
    });

    const sortedDates = [...dateMap.keys()].sort();
    const aggregated = sortedDates.map((date) => ({
      date,
      valuation_sgd: dateMap.get(date),
    }));

    const latest = aggregated[aggregated.length - 1]?.valuation_sgd || 0;
    const first = aggregated[0]?.valuation_sgd || 0;
    const changePct = first > 0 ? ((latest - first) / first) * 100 : 0;

    return {
      data: aggregated,
      totalValue: latest,
      changeLabel: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}% over period`,
      changePositive: changePct >= 0,
    };
  }, [propertyDetails]);

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
            <div className="property-list">{properties.map((property) => <PropertyRow key={property.id} property={property} onClick={() => navigate(`/properties/${property.id}`)} />)}</div>
          ) : (
            <div className="empty-state"><Building2 size={22} /><p>No properties connected yet.</p><button className="dark-button" onClick={() => navigate('/properties')}><Plus size={15} /> Add your first property</button></div>
          )}
          {properties.length > 0 && <button className="view-all" onClick={() => navigate('/properties')}>View all properties <ArrowUpRight size={15} /></button>}
        </div>
        <div className="section-card insight-card refinance-insight-link" onClick={() => navigate('/refinance')}>
          <div className="insight-top"><div className="insight-icon"><Sparkles size={18} /></div><span>REFINANCE</span></div>
          <h2>Check your<br /><em>refinance options</em>.</h2>
          <p>Compare rates from partner banks and see how much you could save on monthly repayments.</p>
          <div className="insight-footer"><TrendingUp size={15} /> View refinance offers <ArrowUpRight size={14} /></div>
        </div>
      </section>
      <section className="bottom-grid">
        <div className="section-card chart-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">PORTFOLIO PERFORMANCE</p>
              <h2>Portfolio value over time</h2>
            </div>
            <span className="live-badge"><span className="live-pulse" /> Live</span>
          </div>
          <ValuationChart
            data={portfolioChart.data}
            currentValue={portfolioChart.totalValue || totalValue}
            changeLabel={portfolioChart.changeLabel || 'No trend data yet'}
            changePositive={portfolioChart.changePositive}
            emptyMessage="Add properties to see your portfolio performance chart."
          />
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
