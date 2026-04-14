import { useTheme } from "../context/ThemeContext";

export default function TaskCard({ task, onClick, onDelete, onToggleStatus }) {
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
    Work:  { color: '#4F6EF7', bg: '#EEF1FE' },
    Study: { color: '#7C3AED', bg: '#F5F3FF' },
    Life:  { color: '#10B981', bg: '#D1FAE5' },
  };
  const cCfg = task.category ? (categoryConfig[task.category] || null) : null;

  const isOverdue = task.due_date && !statusDone
    && new Date(task.due_date) < new Date();

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

          {/* Meta row */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px'
          }}>
            {cCfg && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 7px',
                borderRadius: '99px',
                fontSize: '10px',
                fontWeight: '600',
                background: cCfg.bg,
                color: cCfg.color,
              }}>
                {task.category}
              </span>
            )}
            {task.due_date && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontWeight: '500',
                  color: isOverdue ? '#EF4444' : (isDark ? '#8E8E93' : '#6E6E73'),
                  whiteSpace: 'nowrap'
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {isOverdue ? 'Overdue · ' : ''}{formatTime(task.due_date)}
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
