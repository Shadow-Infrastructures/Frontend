import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en-SG', { month: 'short', year: 'numeric' }).format(d);
}

function formatMoneyShort(value) {
  const num = Number(value || 0);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num}`;
}

const CHART_W = 600;
const CHART_H = 180;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 8;

export default function ValuationChart({ data, currentValue, changeLabel, changePositive = true, emptyMessage = 'Valuation trend data will appear here once available.' }) {
  const { linePath, areaPath, points, yLabels, xLabels, hasData } = useMemo(() => {
    if (!data || data.length < 2) {
      return { linePath: '', areaPath: '', points: [], yLabels: [], xLabels: [], hasData: false };
    }

    const values = data.map((d) => Number(d.valuation));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const usableH = CHART_H - PADDING_TOP - PADDING_BOTTOM;
    const stepX = CHART_W / (data.length - 1);

    const pts = data.map((d, i) => {
      const val = Number(d.valuation_sgd || d.valuation || 0);
      const x = i * stepX;
      const y = PADDING_TOP + usableH - ((val - min) / range) * usableH;
      return { x, y, val, date: d.date };
    });

    let line = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cx = (prev.x + curr.x) / 2;
      line += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`;
    }
    const area = `${line} L ${CHART_W},${CHART_H} L 0,${CHART_H} Z`;

    const yVals = [max, min + range * 0.5, min];
    const yLbls = yVals.map((v) => formatMoneyShort(v));

    const xLbls = data.map((d) => formatShortDate(d.date));

    return { linePath: line, areaPath: area, points: pts, yLabels: yLbls, xLabels: xLbls, hasData: true };
  }, [data]);

  if (!hasData) {
    return (
      <div className="empty-state">
        <TrendingUp size={22} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="valuation-chart-wrap">
      <div className="valuation-chart-summary">
        <strong>{formatMoneyShort(currentValue)}</strong>
        <span className={changePositive ? 'trend-up' : 'trend-down-text'}>
          {changePositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {changeLabel}
        </span>
      </div>
      <div className="valuation-chart">
        <div className="chart-y-labels valuation-y-labels">
          {yLabels.map((lbl, i) => (
            <span key={i}>{lbl}</span>
          ))}
        </div>
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00bfa5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#00bfa5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke="#00bfa5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#00bfa5" className="trend-dot" />
          ))}
        </svg>
        <div className="chart-x-labels valuation-x-labels">
          {xLabels.map((lbl, i) => (
            <span key={i}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
