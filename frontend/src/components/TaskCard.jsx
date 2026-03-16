export default function TaskCard({ task, onClick, onDelete, onToggleStatus }) {
  // 确保 statusDone 是布尔值，避免显示"0"
  const statusDone = Boolean(task.completed);
  
  // 获取实时时间
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `Today · ${formattedHours}:${minutes} ${period}`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-3xl px-4 py-3 mb-3 shadow-sm border border-slate-100 active:scale-[0.99] transition"
    >
      <div className="flex items-start gap-3">
        {/* 圆形勾选框 */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus && onToggleStatus();
          }}
          className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${
            statusDone
              ? "border-green-500 bg-green-500"
              : "border-slate-300 bg-white"
          }`}
        >
          {statusDone && (
            <span className="text-white text-[10px] font-bold">✓</span>
          )}
        </div>

        <div className="flex-1">
          <div
            className={`text-sm font-semibold ${
              statusDone ? "line-through text-slate-400" : "text-slate-900"
            }`}
          >
            {task.title || "(Untitled)"}
          </div>
          {task.description && (
            <div className="mt-1 text-xs text-slate-500 line-clamp-1">
              {task.description}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              {getCurrentTime()}
            </div>
            {/* 暂时移除 Work 标签，因为还没有添加分区功能 */}
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[11px] text-red-500 px-3 py-1 rounded-full bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </button>
  );
}