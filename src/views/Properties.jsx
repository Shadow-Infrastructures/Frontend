import { useState } from 'react';
import { ArrowUpRight, Building2, Home, Plus, TrendingUp } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatMoney } from '@/utils/format';
import PageHeader from '@/components/PageHeader';
import AddPropertyModal from '@/components/AddPropertyModal';

/** Portfolio view with backend-backed property creation. */
export default function Properties() {
  const { properties, loading, reload } = useDashboardData();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <div className="loading-state">Loading your properties...</div>;

  return (
    <>
      <PageHeader eyebrow="PORTFOLIO" title="My properties" subtitle="Everything you own, in one place." action={<button className="dark-button" onClick={() => setModalOpen(true)}><Plus size={16} /> Add property</button>} />
      {properties.length ? (
        <section className="property-detail-grid">
          {properties.map((property) => (
            <div className="section-card property-detail-card" key={property.id}>
              <div className={`property-hero ${property.accent || 'mint'}`}><Home size={30} /></div>
              <div className="property-detail-body">
                <div className="property-detail-head">
                  <div>
                    <small>{property.type}</small>
                    <h2>{property.name}</h2>
                    <span className="property-detail-address"><Building2 size={13} /> {property.address}</span>
                  </div>
                </div>
                <div className="property-detail-stats">
                  <div><span>Estimated value</span><strong>{formatMoney(property.value)}</strong><i className="trend-up"><TrendingUp size={12} /> {property.change}</i></div>
                  <div><span>Purchase price</span><strong>{formatMoney(property.purchase_price_sgd)}</strong><i>Backend record</i></div>
                  <div><span>Tenure</span><strong>{String(property.tenure || 'Not provided').replaceAll('_', ' ')}</strong><i>Property details</i></div>
                </div>
                <button className="view-all">View details <ArrowUpRight size={15} /></button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="section-card empty-page-state"><Building2 size={30} /><h2>No properties yet</h2><p>Add your first property to start building your owner space.</p><button className="dark-button" onClick={() => setModalOpen(true)}><Plus size={16} /> Add property</button></section>
      )}
      {properties.length > 0 && <section className="section-card summary-strip"><div className="summary-item"><div className="stat-icon"><Building2 size={17} /></div><div><span>Total value</span><strong>{formatMoney(properties.reduce((sum, item) => sum + Number(item.value || 0), 0))}</strong></div></div><div className="summary-divider" /><div className="summary-item"><div className="stat-icon pale-coral"><TrendingUp size={17} /></div><div><span>Connected properties</span><strong>{properties.length}</strong></div></div></section>}
      {modalOpen && <AddPropertyModal onClose={() => setModalOpen(false)} onSaved={reload} />}
    </>
  );
}
