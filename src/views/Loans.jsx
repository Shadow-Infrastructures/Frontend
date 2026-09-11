import { Calendar, Landmark, WalletCards } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatMoney } from '@/utils/format';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';

/** Loan tracker populated from GET /api/v1/loans. */
export default function Loans() {
  const { loans, loading } = useDashboardData();
  const total = loans.reduce((sum, item) => sum + Number(item.balance || 0), 0);
  const monthly = loans.reduce((sum, item) => sum + Number(item.monthly || 0), 0);
  const averageRate = loans.length ? loans.reduce((sum, item) => sum + Number(item.rate || 0), 0) / loans.length : 0;

  if (loading) return <div className="loading-state">Loading your loans...</div>;

  return (
    <>
      <PageHeader eyebrow="DEBT MANAGEMENT" title="Loan tracker" subtitle="Track balances, rates and payments across all your loans." />
      <section className="stat-grid">
        <StatCard tone="dark" label="Total outstanding" value={formatMoney(total)} foot={<span>Across {loans.length} loans</span>} icon={Landmark} />
        <StatCard label="Monthly repayments" value={formatMoney(monthly)} foot={<span>Live loan data</span>} icon={WalletCards} />
        <StatCard label="Average rate" value={averageRate ? `${averageRate.toFixed(2)}%` : '—'} foot={<span>Across connected loans</span>} icon={Landmark} />
      </section>
      <section className="section-card">
        <div className="card-header"><div><p className="eyebrow">ACTIVE LOANS</p><h2>Your loans</h2></div></div>
        {loans.length ? <div className="loan-list">{loans.map((loan) => <div className="loan-row" key={loan.id}><div className="loan-bank">{loan.bank}</div><div className="loan-info"><strong>{loan.property}</strong><span>{loan.rate}% · {loan.remaining} remaining</span></div><div className="loan-stat"><span>Balance</span><strong>{formatMoney(loan.balance)}</strong></div><div className="loan-stat"><span>Monthly</span><strong>{formatMoney(loan.monthly)}</strong></div><div className="loan-ltv"><span>LTV {loan.ltv}%</span><div className="progress-line"><span style={{ width: `${Math.min(Number(loan.ltv) || 0, 100)}%` }} /></div></div><div className="loan-due"><Calendar size={13} /> {loan.nextDue}</div></div>)}</div> : <div className="empty-state"><Landmark size={22} /><p>No loans connected yet.</p></div>}
      </section>
    </>
  );
}
