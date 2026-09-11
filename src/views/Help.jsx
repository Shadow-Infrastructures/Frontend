import { useState } from 'react';
import { Calendar, ChevronRight, FileText, Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

/** Static support content; account and portfolio data remain backend-driven. */
export default function Help() {
  const faqs = [
    { q: 'How do I add a new property?', a: 'Open My properties and choose Add property. Enter the requested details, then save.' },
    { q: 'How is my property value calculated?', a: 'Your latest property valuation is supplied by the TreeHouse backend.' },
    { q: 'How do I manage documents?', a: 'Documents connected to your account appear automatically in the Document vault.' },
  ];
  const [query, setQuery] = useState('');
  const visible = faqs.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeader eyebrow="SUPPORT" title="Help centre" subtitle="Answers and support, whenever you need it." />
      <section className="section-card help-hero"><div className="help-search"><Search size={18} /><input placeholder="Search for help..." value={query} onChange={(e) => setQuery(e.target.value)} /></div></section>
      <section className="content-grid"><div className="section-card"><div className="card-header"><div><p className="eyebrow">FAQ</p><h2>Common questions</h2></div></div><div className="faq-list">{visible.map((faq) => <details className="faq-item" key={faq.q}><summary><span>{faq.q}</span><ChevronRight size={16} className="faq-chevron" /></summary><p>{faq.a}</p></details>)}{!visible.length && <p className="empty-state">No answers found.</p>}</div></div><div className="section-card"><div className="card-header"><div><p className="eyebrow">CONTACT</p><h2>Get in touch</h2></div></div><div className="contact-list"><a className="contact-item" href="mailto:support@treehouse.app"><div className="contact-icon"><FileText size={17} /></div><div><strong>Email us</strong><span>support@treehouse.app</span></div></a><div className="contact-item"><div className="contact-icon"><Calendar size={17} /></div><div><strong>Adviser hours</strong><span>Mon–Fri, 9am–6pm</span></div></div></div></div></section>
    </>
  );
}
