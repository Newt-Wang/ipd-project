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
    High:   { cls: 'badge-high',   label: 'High',   bg: '#FEE2E2', color: '#991B1B' },
    Medium: { cls: 'badge-medium', label: 'Medium', bg: '#FEF3C7', color: '#92400E' },
    Low:    { cls: 'badge-low',    label: 'Low',    bg: '#D1FAE5', color: '#065F46' },
  };
  const pCfg = priorityConfig[task.priority] || priorityConfig.Medium;

  const isOverdue = task.due_date && !statusDone
    && new Date(task.due_date) < new Date();

  return (
    <div className={`p-5 mb-4 rounded-xl transition-all ${statusDone ? 'opacity-60' : ''}`} style={{ 
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
    }}>
      <div className="flex items-start gap-4">

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
            border: '2px solid #E5E5EA',
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
          <div className="flex items-start justify-between gap-3">
            <span
              style={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '1.4',
                color: statusDone ? '#8E8E93' : '#1D1D1F',
                textDecoration: statusDone ? 'line-through' : 'none',
                flex: 1
              }}
            >
              {task.title || "(Untitled)"}
            </span>
            <div style={{ 
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ 
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: pCfg.bg === '#FEE2E2' ? '#EF4444' : 
                           pCfg.bg === '#FEF3C7' ? '#F59E0B' : '#10B981'
              }}/>
              <span style={{ 
                fontSize: '12px',
                fontWeight: '500',
                color: pCfg.color
              }}>
                {pCfg.label}
              </span>
            </div>
          </div>

          {task.description && (
            <p style={{ 
              marginTop: '8px',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#8E8E93',
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
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px'
          }}>
            {task.created_at && (
              <span style={{ color: '#8E8E93' }}>
                Created {formatTime(task.created_at)}
              </span>
            )}
            {task.due_date && (
              <span
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '500',
                  color: isOverdue ? 'rgba(255, 149, 0, 0.7)' : '#6E6E73',
                  whiteSpace: 'nowrap'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {isOverdue ? 'Overdue' : ''}{isOverdue && ' · '}{formatTime(task.due_date)}
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
              opacity: 0.6,
              transition: 'all 0.3s ease',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 0.6;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
