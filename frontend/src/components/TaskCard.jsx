export default function TaskCard({ task, onClick, onDelete, onToggleStatus }) {
  // 确保 statusDone 是布尔值，避免显示"0"
  const statusDone = Boolean(task.completed);
  
  // 统一时间格式化函数
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // 检查是否是今天
    if (dateOnly.getTime() === today.getTime()) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `今天 ${hours}:${minutes}`;
    }
    
    // 检查是否是今年
    if (date.getFullYear() === now.getFullYear()) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
    }
    
    // 去年及更早
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
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
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus && onToggleStatus();
          }}
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
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-sm text-red-500 px-4 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      )}
    </button>
  );
}