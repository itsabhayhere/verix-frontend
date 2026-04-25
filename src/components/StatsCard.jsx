'use client';

import { useEffect, useState } from 'react';

/**
 * label   → metric name
 * value   → metric value
 * variant → success | warning | danger | neutral
 * trend   → "+12%" | "-4%" etc
 * icon    → optional custom icon
 * loading → skeleton state
 */

export default function StatsCard({
  label,
  value,
  variant = 'neutral',
  trend,
  icon,
  loading = false
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const themes = {
    neutral: {
      text: 'var(--text-primary)',
      sub: 'var(--text-tertiary)',
      accent: 'var(--border-strong)',
      bg: 'var(--bg-muted)',
    },
    success: {
      text: 'var(--accent-success)',
      sub: 'var(--accent-success)',
      accent: 'var(--accent-success)',
      bg: 'var(--accent-success-light)',
    },
    warning: {
      text: 'var(--accent-warning)',
      sub: 'var(--accent-warning)',
      accent: 'var(--accent-warning)',
      bg: 'var(--accent-warning-light)',
    },
    danger: {
      text: 'var(--accent-danger)',
      sub: 'var(--accent-danger)',
      accent: 'var(--accent-danger)',
      bg: 'var(--accent-danger-light)',
    },
  };

  const theme = themes[variant] || themes.neutral;

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat().format(num);
  };

  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend.startsWith('+')) return '📈';
    if (trend.startsWith('-')) return '📉';
    return '➖';
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-[var(--bg-surface)] border rounded-[var(--radius-md)] p-5 h-[110px]" />
    );
  }

  return (
    <div className="relative overflow-hidden group bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">

      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: theme.accent }}
      />

      <div className="flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-start justify-between">

          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
            {label}
          </span>

          <div
            className="p-1.5 rounded-lg border"
            style={{
              backgroundColor: theme.bg,
              borderColor: theme.accent + '20'
            }}
          >
            {icon || <StatusIcon variant={variant} />}
          </div>

        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2">

          <h4
            className="text-2xl font-bold font-mono tracking-tighter"
            style={{ color: theme.text }}
          >
            {formatNumber(displayValue)}
          </h4>

          {trend && (
            <span
              className="text-[10px] font-bold font-mono opacity-70 flex items-center gap-1"
              style={{ color: theme.sub }}
            >
              {getTrendIcon()} {trend}
            </span>
          )}

        </div>

      </div>
    </div>
  );
}


/* Icon system */

function StatusIcon({ variant }) {
  const props = {
    width: 14,
    height: 14,
    strokeWidth: 2.5,
    stroke: 'currentColor',
    fill: 'none'
  };

  switch (variant) {
    case 'success':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      );

    case 'warning':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );

    case 'danger':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      );

    default:
      return (
        <svg {...props} viewBox="0 0 24 24">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      );
  }
}