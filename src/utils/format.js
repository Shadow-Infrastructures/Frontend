/**
 * Currency and text formatting helpers used across the dashboard.
 */

import { use } from "react";

/** Format a number as Singapore Dollars with no decimals. */
export function formatMoney(value) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

/**
 * Derive a display name from a user object returned by the backend.
 * Falls back through full_name, email prefix, and a generic label.
 */
export function displayName(user) {
  return (
    user?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Property owner'
  );
}

/**
 * Normalise a property row from the backend into the shape the UI expects.
 * The backend may return snake_case keys; we map them to the UI's camelCase.
 */
export function normaliseProperty(item) {
  return {
    ...item,
    name: item.name || item.address_line_1 || 'Untitled property',
    address:
      item.address ||
      [item.address_line_1, item.unit_number].filter(Boolean).join(', '),
    type: item.type || item.property_type || 'Property',
    value: item.value || item.current_estimated_valuation_sgd || item.purchase_price_sgd || 0,
    change: item.change || '+0.0%',
    accent: item.accent || 'mint',
  };
}

/**
 * Normalise a loan row, linking it to its parent property for display.
 */
export function normaliseLoan(item, properties) {
  const property = properties.find((entry) => entry.id === item.property_id);
  return {
    ...item,
    property: item.property || property?.name || 'Property loan',
    bank: item.bank || item.lender_name || 'Lender',
    balance: item.balance || item.principal_amount_sgd || 0,
    monthly: item.monthly || item.monthly_payment_sgd || 0,
    rate: item.rate || item.interest_rate_annual || 0,
    remaining: item.remaining || `${item.loan_term_years || 0} years`,
    ltv: item.ltv || 44,
    nextDue: item.nextDue || item.next_due || 'Upcoming',
  };
}
