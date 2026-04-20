import { useTheme } from "../context/ThemeContext";

export default function TaskCard({ task, onClick, onDelete, onToggleStatus, viewMode = "all" }) {
  const { isDark } = useTheme();
  const statusDone = Boolean(task.completed);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dateOnly.getTime() === today.getTime()) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Today ${hours}:${minutes}`;
    }
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const priorityConfig = {
    High:   { cls: 'badge-high',   label: 'High',   bg: '#FEE2E2', color: '#DC2626', bar: '#EF4444' },
    Medium: { cls: 'badge-medium', label: 'Medium', bg: '#FEF3C7', color: '#D97706', bar: '#F59E0B' },
    Low:    { cls: 'badge-low',    label: 'Low',    bg: '#D1FAE5', color: '#059669', bar: '#10B981' },
  };
  const pCfg = priorityConfig[task.priority] || priorityConfig.Medium;

  const categoryConfig = {
    Work:  { color: '#4F6EF7', bg: '#EEF1FE', darkBg: 'rgba(79,110,247,0.18)', icon: '💼' },
    Study: { color: '#7C3AED', bg: '#F5F3FF', darkBg: 'rgba(124,58,237,0.18)', icon: '📚' },
    Life:  { color: '#10B981', bg: '#D1FAE5', darkBg: 'rgba(16,185,129,0.18)', icon: '🌿' },
  };
  const cCfg = task.category ? (categoryConfig[task.category] || null) : null;

  const isOverdue = task.due_date && !statusDone
    && new Date(task.due_date) < new Date();

  // ── STATUS view ───────────────────────────────────────────────────────────
  if (viewMode === "status") {
    return (
      <div
        className={`rounded-xl transition-all ${statusDone ? 'opacity-60' : ''}`}
        style={{
          background: isDark ? 'rgba(30,30,30,0.95)' : '#FFFFFF',
          boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          transition: 'all 0.15s ease',
          borderLeft: `4px solid ${statusDone ? '#34C759' : '#F59E0B'}`,
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          if (!statusDone) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 6px 16px rgba(0,0,0,0.5)'
              : '0 6px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isDark
            ? '0 1px 4px rgba(0,0,0,0.4)'
            : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)';
        }}
      >
        {/* Status banner */}
        <div style={{
          padding: '6px 12px',
          background: statusDone
            ? (isDark ? 'rgba(52,199,89,0.15)' : '#F0FDF4')
            : (isDark ? 'rgba(245,158,11,0.15)' : '#FFFBEB'),
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: isDark ? '1px solid rgba(50,50,50,0.4)' : '1px solid rgba(0,0,0,0.05)'
        }}>
          <span style={{
            fontSize: '18px',
            lineHeight: 1,
          }}>
            {statusDone ? '✅' : '⏳'}
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '0.5px',
            color: statusDone ? '#34C759' : '#F59E0B',
            textTransform: 'uppercase',
          }}>
            {statusDone ? 'Completed' : 'Pending'}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 7px',
            borderRadius: '6px',
            background: pCfg.bg,
            color: pCfg.color,
          }}>
            {pCfg.label}
          </span>
        </div>

        <div className="flex items-start gap-3" style={{ padding: '10px 12px 10px 12px' }}>
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus && onToggleStatus(); }}
            style={{
              flexShrink: 0, marginTop: '2px',
              width: '22px', height: '22px', borderRadius: '50%',
              border: statusDone ? 'none' : `2px solid ${isDark ? 'rgba(245,158,11,0.5)' : '#F59E0B'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
              background: statusDone ? '#34C759' : 'transparent',
              cursor: 'pointer',
            }}
            aria-label="Toggle task status"
          >
            {statusDone && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={onClick} style={{ cursor: 'pointer' }}>
            <span style={{
              fontSize: '13px', fontWeight: '600', lineHeight: '1.4',
              color: statusDone ? '#8E8E93' : (isDark ? '#F5F5F7' : '#1D1D1F'),
              textDecoration: statusDone ? 'line-through' : 'none',
              display: 'block',
            }}>
              {task.title || "(Untitled)"}
            </span>
            {task.description && (
              <p style={{
                marginTop: '4px', fontSize: '12px', lineHeight: '1.4',
                color: isDark ? '#8E8E93' : '#8E8E93',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {task.description}
              </p>
            )}
            <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px' }}>
              {cCfg && (
                <span style={{
                  padding: '2px 8px', borderRadius: '99px',
                  fontWeight: '600', background: cCfg.bg, color: cCfg.color,
                }}>
                  {cCfg.icon} {task.category}
                </span>
              )}
              {task.due_date && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '3px',
                  fontWeight: '500',
                  color: isOverdue ? '#EF4444' : (isDark ? '#8E8E93' : '#6E6E73'),
                }}>
                  📅 {isOverdue ? 'Overdue · ' : ''}{formatTime(task.due_date)}
                </span>
              )}
            </div>
          </div>

          {/* Delete */}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this task?')) onDelete(); }}
              style={{
                flexShrink: 0, opacity: 0, transition: 'all 0.15s ease',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
              className="task-card-delete"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── CATEGORY view ─────────────────────────────────────────────────────────
  if (viewMode === "category") {
    const catColors = cCfg || { color: '#6E6E73', bg: '#F3F4F6', darkBg: 'rgba(110,110,115,0.2)', icon: '📌' };
    return (
      <div
        className={`rounded-xl transition-all ${statusDone ? 'opacity-55' : ''}`}
        style={{
          background: isDark ? 'rgba(30,30,30,0.95)' : '#FFFFFF',
          boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          transition: 'all 0.15s ease',
          borderLeft: `4px solid ${catColors.color}`,
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          if (!statusDone) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isDark
              ? '0 6px 16px rgba(0,0,0,0.5)'
              : '0 6px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isDark
            ? '0 1px 4px rgba(0,0,0,0.4)'
            : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)';
        }}
      >
        {/* Category hero banner */}
        <div style={{
          padding: '8px 14px',
          background: isDark ? catColors.darkBg : catColors.bg,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: `1px solid ${catColors.color}30`,
        }}>
          <span style={{ fontSize: '22px', lineHeight: 1 }}>{catColors.icon}</span>
          <span style={{
            fontSize: '15px',
            fontWeight: '800',
            letterSpacing: '0.4px',
            color: catColors.color,
          }}>
            {task.category || 'Uncategorized'}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontSize: '10px', fontWeight: '600',
            padding: '2px 7px', borderRadius: '6px',
            background: pCfg.bg, color: pCfg.color,
          }}>
            {pCfg.label}
          </span>
        </div>

        <div className="flex items-start gap-3" style={{ padding: '10px 12px 10px 12px' }}>
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus && onToggleStatus(); }}
            style={{
              flexShrink: 0, marginTop: '2px',
              width: '20px', height: '20px', borderRadius: '50%',
              border: isDark ? '2px solid rgba(50,50,50,0.6)' : '2px solid #E5E5EA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
              background: statusDone ? '#34C759' : 'transparent',
              cursor: 'pointer',
            }}
            aria-label="Toggle task status"
          >
            {statusDone && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0" onClick={onClick} style={{ cursor: 'pointer' }}>
            <span style={{
              fontSize: '13px', fontWeight: '600', lineHeight: '1.4',
              color: statusDone ? '#8E8E93' : (isDark ? '#F5F5F7' : '#1D1D1F'),
              textDecoration: statusDone ? 'line-through' : 'none',
              display: 'block',
            }}>
              {task.title || "(Untitled)"}
            </span>
            {task.description && (
              <p style={{
                marginTop: '4px', fontSize: '12px', lineHeight: '1.4',
                color: isDark ? '#8E8E93' : '#8E8E93',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {task.description}
              </p>
            )}
            <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px' }}>
              {statusDone && (
                <span style={{ padding: '2px 8px', borderRadius: '99px', fontWeight: '600', background: '#D1FAE5', color: '#059669' }}>
                  ✓ Done
                </span>
              )}
              {task.due_date && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '500',
                  color: isOverdue ? '#EF4444' : (isDark ? '#8E8E93' : '#6E6E73'),
                }}>
                  📅 {isOverdue ? 'Overdue · ' : ''}{formatTime(task.due_date)}
                </span>
              )}
            </div>
          </div>

          {/* Delete */}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); if (window.confirm('Are you sure you want to delete this task?')) onDelete(); }}
              style={{
                flexShrink: 0, opacity: 0, transition: 'all 0.15s ease',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
              className="task-card-delete"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── ALL TASKS (default) ───────────────────────────────────────────────────
  return (
    <div className={`rounded-xl transition-all ${statusDone ? 'opacity-50' : ''}`} style={{
      background: isDark ? 'rgba(30, 30, 30, 0.95)' : '#FFFFFF',
      boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif',
      transition: 'all 0.15s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderLeft: `3px solid ${pCfg.bar}`,
    }} onMouseEnter={(e) => {
      if (!statusDone) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 6px 16px rgba(0,0,0,0.5)'
          : '0 6px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)';
      }
    }} onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = isDark
        ? '0 1px 4px rgba(0,0,0,0.4)'
        : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)';
    }}>
      <div className="flex items-start gap-3" style={{ padding: '12px 12px 10px 12px' }}>

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus && onToggleStatus();
          }}
          style={{
            flexShrink: 0,
            marginTop: '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: isDark ? '2px solid rgba(50, 50, 50, 0.6)' : '2px solid #E5E5EA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            background: statusDone ? '#34C759' : 'transparent',
            cursor: 'pointer'
          }}
          aria-label="Toggle task status"
        >
          {statusDone && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={onClick} style={{ cursor: 'pointer' }}>
          <div className="flex items-start justify-between gap-2">
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                lineHeight: '1.4',
                color: statusDone ? '#8E8E93' : (isDark ? '#F5F5F7' : '#1D1D1F'),
                textDecoration: statusDone ? 'line-through' : 'none',
                flex: 1
              }}
            >
              {task.title || "(Untitled)"}
            </span>
            <span style={{
              flexShrink: 0,
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 7px',
              borderRadius: '6px',
              background: pCfg.bg,
              color: pCfg.color,
              letterSpacing: '0.3px'
            }}>
              {pCfg.label}
            </span>
          </div>

          {task.description && (
            <p style={{
              marginTop: '6px',
              fontSize: '12px',
              lineHeight: '1.4',
              color: isDark ? '#8E8E93' : '#8E8E93',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {task.description}
            </p>
          )}

          {/* Meta row — All Tasks: show category + date clearly */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
          }}>
            {cCfg && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                padding: '3px 8px', borderRadius: '99px',
                fontSize: '11px', fontWeight: '700',
                background: isDark ? cCfg.darkBg : cCfg.bg,
                color: cCfg.color,
                border: `1px solid ${cCfg.color}30`,
              }}>
                {cCfg.icon} {task.category}
              </span>
            )}
            {task.due_date && (
              <span
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', fontWeight: '600',
                  color: isOverdue ? '#EF4444' : (isDark ? '#8E8E93' : '#555'),
                  background: isOverdue
                    ? (isDark ? 'rgba(239,68,68,0.12)' : '#FEE2E2')
                    : (isDark ? 'rgba(50,50,50,0.6)' : '#F3F4F6'),
                  padding: '3px 8px', borderRadius: '99px',
                  border: isOverdue ? '1px solid #EF444430' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {isOverdue ? 'Overdue · ' : ''}{formatTime(task.due_date)}
              </span>
            )}
            {statusDone && (
              <span style={{
                fontSize: '11px', fontWeight: '600',
                padding: '3px 8px', borderRadius: '99px',
                background: isDark ? 'rgba(52,199,89,0.15)' : '#D1FAE5',
                color: '#059669',
              }}>
                ✓ Done
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete();
              }
            }}
            style={{
              flexShrink: 0,
              opacity: 0,
              transition: 'all 0.15s ease',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
            className="task-card-delete"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
