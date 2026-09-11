import { useEffect, useState } from 'react';
import { listProperties } from '@/api/properties';
import { listLoans } from '@/api/loans';
import { listDocuments } from '@/api/documents';
import { normaliseLoan, normaliseProperty } from '@/utils/format';

/**
 * Fetches properties, loans, and documents from the backend in parallel.
 * Returns loading state, the three collections, and a reload() trigger.
 * On error, each collection falls back to an empty array — the UI shows
 * empty states rather than crashing.
 */
export function useDashboardData() {
  const [data, setData] = useState({
    properties: [],
    loans: [],
    documents: [],
    loading: true,
    error: null,
  });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;

    Promise.all([
      listProperties().catch(() => []),
      listLoans().catch(() => []),
      listDocuments().catch(() => []),
    ])
      .then(([rawProperties, rawLoans, rawDocuments]) => {
        if (!active) return;
        const properties = rawProperties.map(normaliseProperty);
        const loans = rawLoans.map((loan) => normaliseLoan(loan, properties));
        setData({
          properties,
          loans,
          documents: rawDocuments,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setData({
          properties: [],
          loans: [],
          documents: [],
          loading: false,
          error: error.message,
        });
      });

    return () => {
      active = false;
    };
  }, [refresh]);

  return { ...data, reload: () => setRefresh((v) => v + 1) };
}
