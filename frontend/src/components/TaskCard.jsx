export default function TaskCard({ task, onClick, onDelete, onToggleStatus }) {
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
    High:   { cls: 'badge-high',   label: 'High',   dot: '#EF4444' },
    Medium: { cls: 'badge-medium', label: 'Medium', dot: '#F59E0B' },
    Low:    { cls: 'badge-low',    label: 'Low',    dot: '#10B981' },
  };
  const pCfg = priorityConfig[task.priority] || priorityConfig.Medium;

  const isOverdue = task.due_date && !statusDone
    && new Date(task.due_date) < new Date();

  return (
    <div className={`task-card p-4 fade-in-up ${statusDone ? 'done' : ''}`}>
      <div className="flex items-start gap-3">

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus && onToggleStatus();
          }}
          className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
          style={{
            borderColor: statusDone ? 'var(--success)' : 'var(--border)',
            background: statusDone ? 'var(--success)' : 'transparent',
          }}
          aria-label="Toggle task status"
        >
          {statusDone && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={onClick} style={{ cursor: 'pointer' }}>
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-sm font-semibold leading-snug"
              style={{
                color: statusDone ? 'var(--text-tertiary)' : 'var(--text-primary)',
                textDecoration: statusDone ? 'line-through' : 'none',
              }}
            >
              {task.title || "(Untitled)"}
            </span>
            <span className={pCfg.cls} style={{ flexShrink: 0 }}>
              {pCfg.label}
            </span>
          </div>

          {task.description && (
            <p className="mt-1 text-xs leading-relaxed line-clamp-2"
               style={{ color: 'var(--text-tertiary)' }}>
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-2.5 flex items-center gap-3 text-xs">
            {task.created_at && (
              <span style={{ color: 'var(--text-tertiary)' }}>
                Created {formatTime(task.created_at)}
              </span>
            )}
            {task.due_date && (
              <span
                className="flex items-center gap-1 font-medium"
                style={{ color: isOverdue ? '#EF4444' : 'var(--text-secondary)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {isOverdue ? 'Overdue · ' : ''}{formatTime(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete */}
      {onDelete && (
        <div className="mt-3 pt-3 flex justify-end"
             style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all"
            style={{
              color: 'var(--danger)',
              background: 'var(--danger-light)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-light)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
