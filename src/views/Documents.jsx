import { FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';

/** Document vault list populated from GET /api/v1/documents. */
export default function Documents() {
  const { documents, loading } = useDashboardData();
  const [query, setQuery] = useState('');
  const filtered = documents.filter((document) => 
      [
        document.file_name, 
        document.property, 
        document.type, 
        document.category
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .map((document) => {
      const bytes = document.file_size_bytes;
      let formattedSize = '0 Bytes';

      if (bytes > 0) {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      return {
        ...document,
        file_size_bytes: formattedSize // Overwrites the bytes with the KB/MB string
      };
    });

  if (loading) return <div className="loading-state">Loading your documents...</div>;

  return (
    <>
      <PageHeader eyebrow="VAULT" title="Document vault" subtitle="All your property documents, secure and organised." />
      <section className="stat-grid"><StatCard tone="dark" label="Total documents" value={documents.length} foot={<span>Fetched from your account</span>} icon={FileText} /><StatCard label="Search results" value={filtered.length} foot={<span>Matching your search</span>} icon={Search} /></section>
      <section className="section-card">
        <div className="card-header">
          <div>
            <p className="eyebrow">ALL DOCUMENTS</p>
            <h2>Your documents</h2>
          </div>
          
          <div className="search-box">
            <Search size={15} />
            <input 
              placeholder="Search documents..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
        </div>

        {filtered.length ? (
          <div className="document-list">
            {filtered.map((document) => (
              <div className="document-row" key={document.id || document.file_name}>
                <div className="document-icon">
                  <FileText size={18} />
                </div>
                
                <div className="document-info">
                  <strong>{document.file_name}</strong>
                  <span>
                    {document.property || 'Your portfolio'} · {document.type || document.category || 'Document'}
                  </span>
                </div>
                
                <div className="document-date">
                  {document.date || document.created_at || 'Stored securely'}
                </div>
                
                <div className="document-size">
                  {document.file_size_bytes || '—'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={22} />
            <p>
              {query ? `No documents match “${query}”.` : 'No documents connected yet.'}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
