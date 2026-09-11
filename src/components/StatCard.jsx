/**
 * StatCard — a single metric tile used in the stat grids across views.
 * tone="dark" renders the teal background variant.
 * children are rendered below the foot row (used for mini-charts, progress bars).
 */
export default function StatCard({ tone, label, value, foot, icon: Icon, children }) {
  return (
    <div className={`stat-card ${tone === 'dark' ? 'stat-card-dark' : ''}`}>
      <div className="stat-heading">
        <span>{label}</span>
        <div className="stat-icon">
          <Icon size={17} />
        </div>
      </div>
      <strong>{value}</strong>
      <div className="stat-foot">{foot}</div>
      {children}
    </div>
  );
}
