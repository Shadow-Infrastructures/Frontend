import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  ChevronRight,
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

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en-SG', { month: 'short', year: 'numeric' }).format(d);
}

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('en-SG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value || 0));
}

function buildTrendPath(data, width, height) {
  if (!data || data.length < 2) return '';
  const values = data.map((d) => d.valuation_sgd);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.valuation_sgd - min) / range) * (height - 8) - 4;
    return { x, y };
  });

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    path += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
  }
  return path;
}

function buildAreaPath(data, width, height) {
  if (!data || data.length < 2) return '';
  const line = buildTrendPath(data, width, height);
  return `${line} L ${width},${height} L 0,${height} Z`;
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

  const liveTracking = property.live_tracking || {};
  const valuation = liveTracking.valuation_analytics || {};
  const trend = valuation.valuation_trend || [];
  const trendData = trend.map((t) => ({ ...t, valuation_sgd: t.valuation_sgd || t.valuation || 0 }));
  const currentValuation = property.current_estimated_valuation || property.current_estimated_valuation_sgd || 0;
  const purchasePrice = property.purchase_price || property.purchase_price_sgd || 0;
  const gain = valuation.unrealized_capital_gain_sgd || (currentValuation - purchasePrice);
  const appreciation = valuation.appreciation_percentage || (purchasePrice > 0 ? ((currentValuation - purchasePrice) / purchasePrice) * 100 : 0);
  const psf = valuation.psf_sgd || (property.floor_area_sqft ? currentValuation / property.floor_area_sqft : 0);
  const lastUpdated = valuation.last_updated_at || property.created_at;

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
        {trendData.length > 1 ? (
          <div className="valuation-chart-wrap">
            <div className="valuation-chart-summary">
              <strong>{formatMoney(currentValuation)}</strong>
              <span className={gain >= 0 ? 'trend-up' : 'trend-down-text'}>
                <TrendingUp size={13} /> {gain >= 0 ? '+' : ''}{appreciation.toFixed(1)}% since purchase
              </span>
            </div>
            <div className="valuation-chart">
              <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00bfa5" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#00bfa5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={buildAreaPath(trendData, 600, 180)} fill="url(#areaGrad)" />
                <path d={buildTrendPath(trendData, 600, 180)} fill="none" stroke="#00bfa5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {trendData.map((d, i) => {
                  const values = trendData.map((t) => t.valuation_sgd);
                  const min = Math.min(...values);
                  const max = Math.max(...values);
                  const range = max - min || 1;
                  const stepX = 600 / (trendData.length - 1);
                  const x = i * stepX;
                  const y = 180 - ((d.valuation_sgd - min) / range) * (180 - 8) - 4;
                  return <circle key={i} cx={x} cy={y} r="3.5" fill="#00bfa5" className="trend-dot" />;
                })}
              </svg>
              <div className="chart-x-labels valuation-x-labels">
                {trendData.map((d, i) => (
                  <span key={i}>{formatShortDate(d.date)}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state"><TrendingUp size={22} /><p>Valuation trend data will appear here once available.</p></div>
        )}
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
