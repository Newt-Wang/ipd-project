export default function TaskCard({ task, onClick, onDelete, onToggleStatus }) {
  // 确保 statusDone 是布尔值，避免显示"0"
  const statusDone = Boolean(task.completed);
  
  // Unified English time formatting
  const statusDone = Boolean(task.completed);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Today: "Today 14:30"

    if (dateOnly.getTime() === today.getTime()) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Today ${hours}:${minutes}`;
    }
    
    // This year: "Mar 24"
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    }
    
    // Previous years: "Mar 24, 2025"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // 获取实时时间
  const getCurrentTime = () => {
    return formatTime(new Date());
  };

  // 获取优先级标签的样式
  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-3xl p-5 mb-3 border border-slate-100 active:scale-[0.99] transition ${
        statusDone ? 'opacity-60' : 'shadow-sm hover:shadow-lg'
      }`}
      style={{
        boxShadow: statusDone ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* 圆形勾选框 */}
        <div
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
<<<<<<< HEAD
          className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
            statusDone
              ? "border-green-500 bg-green-500"
              : "border-slate-300 bg-white"
          }`}
        >
          {statusDone && (
            <span className="text-white text-[12px] font-bold">✓</span>
          )}
        </div>

        <div className="flex-1">
          <div
            className={`text-base font-semibold ${
              statusDone ? "line-through text-slate-400" : "text-slate-900"
            }`}
          >
            {task.title || "(Untitled)"}
          </div>
          {task.description && (
            <div className="mt-2 text-sm text-slate-500 line-clamp-2">
              {task.description}
            </div>
          )}
          <div className="mt-4 flex flex-col gap-2 text-[12px]">
            <div className="flex items-center justify-between">
              <div className="text-slate-400">
                {getCurrentTime()}
              </div>
              {/* 显示优先级 */}
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeStyle(task.priority || 'Medium')}`}>
                  {task.priority || "Medium"}
                </span>
              </div>
            </div>
            {/* 显示截止日期 */}
            {task.due_date && (
              <div className="flex items-center gap-1 text-slate-400">
                <span>📅</span>
                <span>{formatTime(task.due_date)}</span>
              </div>
            )}
            {Number(task.reminder_minutes_before) > 0 && (
              <div className="flex items-center gap-1 text-slate-400">
                <span>⏰</span>
                <span>{task.reminder_minutes_before} min before</span>
              </div>
=======
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
>>>>>>> origin/main
            )}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {onDelete && (
        <div className="mt-4 flex justify-end">
=======
      {/* Delete */}
      {onDelete && (
        <div className="mt-3 pt-3 flex justify-end"
             style={{ borderTop: '1px solid var(--border)' }}>
>>>>>>> origin/main
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
<<<<<<< HEAD
            className="text-sm text-red-500 px-4 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition"
          >
=======
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
>>>>>>> origin/main
            Delete
          </button>
        </div>
      )}
<<<<<<< HEAD
    </button>
  );
}
=======
    </div>
  );
}
>>>>>>> origin/main
