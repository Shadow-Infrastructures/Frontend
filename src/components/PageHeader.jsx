/**
 * PageHeader — the eyebrow / title / subtitle row at the top of every view.
 * Optional action slot renders a button on the right side.
 */
export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <section className="page-header-row">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}
          <span className="title-dot">.</span>
        </h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {action}
    </section>
  );
}
