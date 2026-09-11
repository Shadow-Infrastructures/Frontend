import { ChevronRight, Home, TrendingUp } from 'lucide-react';
import { formatMoney } from '@/utils/format';

/**
 * PropertyRow — a single property list item used on the overview and
 * properties pages. Clicking the row navigates to the properties detail.
 */
export default function PropertyRow({ property, onClick }) {
  return (
    <button className="property-row" onClick={onClick}>
      <div className={`property-thumbnail ${property.accent || 'mint'}`}>
        <Home size={25} />
      </div>
      <div className="property-info">
        <strong>{property.name}</strong>
        <span>{property.address}</span>
        <small>{property.type}</small>
      </div>
      <div className="property-value">
        <strong>{formatMoney(property.value)}</strong>
        <span>
          <TrendingUp size={13} /> {property.change}
        </span>
      </div>
      <ChevronRight className="row-arrow" size={17} />
    </button>
  );
}
