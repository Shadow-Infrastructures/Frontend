import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Home,
  MapPin,
  TrendingUp,
  Ruler,
  Layers,
  PoundSterling,
} from 'lucide-react';
import { getProperty } from '@/api/properties';
import { formatMoney } from '@/utils/format';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import ValuationChart from '@/components/ValuationChart';

const TENURE_LABELS = {
  '99_YEAR_LEASEHOLD': '99-Year Leasehold',
  '999_YEAR_LEASEHOLD': '999-Year Leasehold',
  FREEHOLD: 'Freehold',
  LEASEHOLD_99: '99-Year Leasehold',
  LEASEHOLD_999: '999-Year Leasehold',
};

const FLOOR_LABELS = {
  LOW_FLOOR: 'Low floor',
  MID_FLOOR: 'Mid floor',
  HIGH_FLOOR: 'High floor',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Singapore',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value || 0));
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getProperty(id)
      .then((res) => {
        if (!active) return;
        setProperty(res?.data || res);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="loading-state">Loading property details...</div>;
  if (error) return (
    <>
      <button className="back-link" onClick={() => navigate('/properties')}>
        <ArrowLeft size={16} /> Back to properties
      </button>
      <div className="error-banner">We could not load this property. Please try again.</div>
    </>
  );
  if (!property) return null;

  const liveTracking = property.live_tracking;
  console.log(liveTracking)
  const valuation = liveTracking;
  console.log(valuation)
  const trend = valuation.valuation_trend;
  console.log(trend)
  const trendData = trend.map((t) => ({ ...t, valuation_sgd: t.valuation_sgd || t.valuation || 0 }));
  console.log(trendData)
  const currentValuation = property.current_estimated_valuation;
  const purchasePrice = property.purchase_price;
  const gain = parseFloat(valuation.unrealized_capital_gain);
  const appreciation = parseFloat(valuation.appreciation_percentage);
  const psf = valuation.psf;
  const lastUpdated = property.created_at;

  const accent = property.accent || 'mint';
  const tenureLabel = TENURE_LABELS[property.tenure] || String(property.tenure || '—').replaceAll('_', ' ');
  const floorLabel = FLOOR_LABELS[property.floor_level] || property.floor_level || '—';
  const addressParts = [property.address_line_1, property.unit_number].filter(Boolean);

  return (
    <>
      <button className="back-link" onClick={() => navigate('/properties')}>
        <ArrowLeft size={16} /> Back to properties
      </button>

      <PageHeader
        eyebrow={property.property_type || property.type || 'PROPERTY'}
        title={property.address_line_1 || property.name || 'Property details'}
        subtitle={[...addressParts, property.district_code, property.postal_code].filter(Boolean).join(' · ')}
      />

      {/* Live tracking stats */}
      <section className="stat-grid">
        <StatCard
          tone="dark"
          label="Current valuation"
          value={formatMoney(currentValuation)}
          foot={<span>Live estimate · {formatDate(lastUpdated)}</span>}
          icon={TrendingUp}
        />
        <StatCard
          label="Capital gain"
          value={formatMoney(gain)}
          foot={<span className={gain >= 0 ? 'trend-up' : ''}>{gain >= 0 ? '+' : ''}{appreciation.toFixed(2)}% appreciation</span>}
          icon={PoundSterling}
        />
        <StatCard
          label="Price per sqft"
          value={`$${formatNumber(psf, 2)}`}
          foot={<span>PSF · SGD</span>}
          icon={Ruler}
        />
      </section>

      {/* Valuation trend chart */}
      <section className="section-card chart-card" style={{ marginBottom: 18 }}>
        <div className="card-header">
          <div>
            <p className="eyebrow">LIVE TRACKING</p>
            <h2>Valuation trend</h2>
          </div>
          <span className="live-badge"><span className="live-pulse" /> Live</span>
        </div>
        <ValuationChart
          data={trendData}
          currentValue={currentValuation}
          changeLabel={`${gain >= 0 ? '+' : ''}${appreciation.toFixed(1)}% since purchase`}
          changePositive={gain >= 0}
        />
      </section>

      {/* Property details grid */}
      <section className="property-info-grid">
        <div className="section-card">
          <div className="card-header">
            <div><p className="eyebrow">PROPERTY DETAILS</p><h2>Specifications</h2></div>
          </div>
          <div className="property-spec-list">
            <div className="property-spec-item">
              <div className="property-spec-icon"><Home size={16} /></div>
              <div><span>Property type</span><strong>{property.property_type || property.type || '—'}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><Building2 size={16} /></div>
              <div><span>Tenure</span><strong>{tenureLabel}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><MapPin size={16} /></div>
              <div><span>District</span><strong>{property.district_code || '—'}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><MapPin size={16} /></div>
              <div><span>Postal code</span><strong>{property.postal_code || '—'}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><Ruler size={16} /></div>
              <div><span>Floor area</span><strong>{formatNumber(property.floor_area_sqft)} sqft</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><Layers size={16} /></div>
              <div><span>Floor level</span><strong>{floorLabel}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><BedDouble size={16} /></div>
              <div><span>Bedrooms</span><strong>{property.bedrooms ?? '—'}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><Bath size={16} /></div>
              <div><span>Bathrooms</span><strong>{property.bathrooms ?? '—'}</strong></div>
            </div>
            <div className="property-spec-item">
              <div className="property-spec-icon"><Calendar size={16} /></div>
              <div><span>Year built</span><strong>{property.year_built || '—'}</strong></div>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <div><p className="eyebrow">FINANCIAL SUMMARY</p><h2>Investment overview</h2></div>
          </div>
          <div className="financial-breakdown">
            <div className="financial-row">
              <span>Purchase price</span>
              <strong>{formatMoney(purchasePrice)}</strong>
            </div>
            <div className="financial-row">
              <span>Current valuation</span>
              <strong>{formatMoney(currentValuation)}</strong>
            </div>
            <div className="financial-row highlight">
              <span>Unrealized capital gain</span>
              <strong className={gain >= 0 ? 'trend-up-text' : 'trend-down-text'}>
                {gain >= 0 ? '+' : ''}{formatMoney(gain)}
              </strong>
            </div>
            <div className="financial-row highlight">
              <span>Appreciation</span>
              <strong className={gain >= 0 ? 'trend-up-text' : 'trend-down-text'}>
                {gain >= 0 ? '+' : ''}{appreciation.toFixed(2)}%
              </strong>
            </div>
            <div className="financial-row">
              <span>Price per sqft</span>
              <strong>${formatNumber(psf, 2)}</strong>
            </div>
            <div className="financial-row">
              <span>Floor area</span>
              <strong>{formatNumber(property.floor_area_sqft)} sqft</strong>
            </div>
          </div>
          <div className="last-updated-row">
            <span className="status-dot" />
            <span>Last updated {formatDate(lastUpdated)}</span>
          </div>
        </div>
      </section>
    </>
  );
}
