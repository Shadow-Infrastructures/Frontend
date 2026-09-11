import { useState } from 'react';
import { Building2, ChevronRight, X } from 'lucide-react';
import { createProperty } from '@/api/properties';

/**
 * AddPropertyModal — form for creating a new property via POST /api/v1/properties.
 * Collects address, unit, type, tenure, postal code, and purchase price.
 * Calls onSaved() on success so the parent can refresh its data.
 */export default function AddPropertyModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    address_line_1: '',
    unit_number: '',
    property_type: 'HDB',
    tenure: 'LEASEHOLD_99',
    postal_code: '',
    purchase_price_sgd: '',
    // --- Added Missing Fields ---
    district_code: '',
    floor_area_sqft: '',
    year_built: '',
    bedrooms: '',
    bathrooms: '',
    floor_level: 'MID', // Defaulting to MID, change as preferred
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await createProperty({
        address_line_1: form.address_line_1,
        unit_number: form.unit_number,
        property_type: form.property_type,
        tenure: form.tenure,
        postal_code: form.postal_code,
        current_estimated_valuation_sgd: Number(form.purchase_price_sgd),
        // --- Mapping Missing Fields + Type Casting ---
        purchase_price: Number(form.purchase_price_sgd), // Backend requires 'purchase_price'
        district_code: form.district_code,
        floor_area_sqft: Number(form.floor_area_sqft),
        year_built: Number(form.year_built),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        floor_level: form.floor_level,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError('Could not save this property. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="modal-icon">
          <Building2 size={20} />
        </div>
        <p className="eyebrow">NEW PROPERTY</p>
        <h2>Add a property</h2>
        <p>Keep all your homes, loans and documents together in one place.</p>
        <form onSubmit={submit}>
          <label>
            Property address
            <input
              required
              value={form.address_line_1}
              onChange={(e) => setForm({ ...form, address_line_1: e.target.value })}
              placeholder="123 Bishan Street 11"
            />
          </label>
          <div className="modal-fields">
            <label>
              Property type
              <select
                value={form.property_type}
                onChange={(e) => setForm({ ...form, property_type: e.target.value })}
              >
                <option value="HDB">HDB Apartment</option>
                <option value="CONDO">Condominium</option>
                <option value="LANDED">Landed property</option>
              </select>
            </label>
            <label>
              Unit number
              <input
                value={form.unit_number}
                onChange={(e) => setForm({ ...form, unit_number: e.target.value })}
                placeholder="#10-15"
              />
            </label>
          </div>
          <div className="modal-fields">
            <label>
              Tenure
              <select
                value={form.tenure}
                onChange={(e) => setForm({ ...form, tenure: e.target.value })}
              >
                <option value="LEASEHOLD_99">Leasehold 99 years</option>
                <option value="LEASEHOLD_999">Leasehold 999 years</option>
                <option value="FREEHOLD">Freehold</option>
              </select>
            </label>
            <label>
              Postal code
              <input
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                placeholder="570123"
              />
            </label>
          </div>

          {/* --- NEW FIELD BLOCK 1 --- */}
          <div className="modal-fields">
            <label>
              District code
              <input
                required
                value={form.district_code}
                onChange={(e) => setForm({ ...form, district_code: e.target.value })}
                placeholder="D20"
              />
            </label>
            <label>
              Floor level
              <select
                value={form.floor_level}
                onChange={(e) => setForm({ ...form, floor_level: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MID">Mid</option>
                <option value="HIGH">High</option>
              </select>
            </label>
          </div>

          {/* --- NEW FIELD BLOCK 2 --- */}
          <div className="modal-fields">
            <label>
              Floor area (sqft)
              <input
                required
                type="number"
                value={form.floor_area_sqft}
                onChange={(e) => setForm({ ...form, floor_area_sqft: e.target.value })}
                placeholder="1100"
              />
            </label>
            <label>
              Year built
              <input
                required
                type="number"
                value={form.year_built}
                onChange={(e) => setForm({ ...form, year_built: e.target.value })}
                placeholder="2015"
              />
            </label>
          </div>

          {/* --- NEW FIELD BLOCK 3 --- */}
          <div className="modal-fields">
            <label>
              Bedrooms
              <input
                required
                type="number"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                placeholder="3"
              />
            </label>
            <label>
              Bathrooms
              <input
                required
                type="number"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                placeholder="2"
              />
            </label>
          </div>

          <label>
            Purchase price (SGD)
            <input
              required
              type="number"
              min="1"
              value={form.purchase_price_sgd}
              onChange={(e) => setForm({ ...form, purchase_price_sgd: e.target.value })}
              placeholder="650000"
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          <button className="dark-button full-button" disabled={busy}>
            {busy ? 'Saving...' : 'Save property'} <ChevronRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}