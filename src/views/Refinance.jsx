import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Landmark, Sparkles, TrendingDown, WalletCards } from 'lucide-react';
import { listRefinanceOptions } from '@/api/refinance';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatMoney } from '@/utils/format';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';

function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value || 0));
}

export default function Refinance() {
  const { properties, loans, loading: dashLoading } = useDashboardData();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    listRefinanceOptions()
      .then((data) => { if (active) { setOptions(data); setLoading(false); } })
      .catch(() => { if (active) { setOptions([]); setLoading(false); } });
    return () => { active = false; };
  }, []);

  const totalOutstanding = loans.reduce((s, l) => s + Number(l.balance || 0), 0);
  const avgRate = loans.length ? loans.reduce((s, l) => s + Number(l.rate || 0), 0) / loans.length : 0;
  const monthly = loans.reduce((s, l) => s + Number(l.monthly || 0), 0);

  const isLoading = loading || dashLoading;
  if (isLoading) return <div className="loading-state">Loading refinance options...</div>;

  return (
    <>
      <PageHeader
        eyebrow="REFINANCE"
        title="Refinance options"
        subtitle="Compare rates and see how much you could save by refinancing your loans."
      />

      <section className="stat-grid">
        <StatCard tone="dark" label="Outstanding debt" value={formatMoney(totalOutstanding)} foot={<span>Across {loans.length} loans</span>} icon={Landmark} />
        <StatCard label="Current average rate" value={avgRate ? `${avgRate.toFixed(2)}%` : '—'} foot={<span>Weighted by connected loans</span>} icon={WalletCards} />
        <StatCard label="Monthly repayments" value={formatMoney(monthly)} foot={<span>Current obligation</span>} icon={TrendingDown} />
      </section>

      {options.length > 0 ? (
        <>
          <section className="refinance-hero">
            <div className="refinance-hero-card">
              <div className="refinance-hero-icon"><Sparkles size={20} /></div>
              <div>
                <h2>You could save on your monthly repayments</h2>
                <p>Compare your current loans against the latest refinance offers from partner banks.</p>
              </div>
            </div>
          </section>

          <section className="refinance-grid">
            {options.map((opt, i) => {
              const rate = opt.interest_rate_annual || opt.rate || 0;
              const bank = opt.lender_name || opt.bank || 'Lender';
              const monthlyPayment = opt.monthly_payment_sgd || opt.monthly || 0;
              const savings = opt.monthly_savings_sgd || opt.savings || 0;
              const features = opt.features || [];
              const tag = opt.tag || (i === 0 ? 'BEST RATE' : 'OFFER');

              return (
                <div className="section-card refinance-card" key={opt.id || i}>
                  <span className="refinance-tag">{tag}</span>
                  <h2>{bank}</h2>
                  <div className="refinance-rate">
                    <strong>{rate.toFixed(2)}%</strong>
                    <span>per annum</span>
                  </div>
                  <div className="refinance-stats">
                    <div>
                      <span>Monthly payment</span>
                      <strong>{formatMoney(monthlyPayment)}</strong>
                    </div>
                    <div>
                      <span>Monthly savings</span>
                      <strong className="trend-up-text">{formatMoney(savings)}</strong>
                    </div>
                  </div>
                  {features.length > 0 && (
                    <ul className="refinance-features">
                      {features.map((f, j) => (
                        <li key={j}><Check size={14} /> {f}</li>
                      ))}
                    </ul>
                  )}
                  <button className="dark-button" style={{ width: '100%', marginTop: 16 }}>
                    Apply now <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </section>

          {loans.length > 0 && (
            <section className="section-card" style={{ marginTop: 18 }}>
              <div className="card-header">
                <div><p className="eyebrow">YOUR CURRENT LOANS</p><h2>Compare against your existing loans</h2></div>
              </div>
              <div className="loan-list">
                {loans.map((loan) => (
                  <div className="loan-row" key={loan.id}>
                    <div className="loan-bank">{loan.bank}</div>
                    <div className="loan-info"><strong>{loan.property}</strong><span>{loan.rate}% · {loan.remaining} remaining</span></div>
                    <div className="loan-stat"><span>Balance</span><strong>{formatMoney(loan.balance)}</strong></div>
                    <div className="loan-stat"><span>Monthly</span><strong>{formatMoney(loan.monthly)}</strong></div>
                    <button className="view-all" onClick={() => navigate('/loans')}>View loan <ArrowRight size={14} /></button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="section-card empty-page-state">
          <Landmark size={30} />
          <h2>No refinance offers available</h2>
          <p>Once your loan data is connected, we will show tailored refinance options here.</p>
        </section>
      )}
    </>
  );
}
