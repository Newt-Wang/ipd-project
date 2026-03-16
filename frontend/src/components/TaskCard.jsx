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
      className="w-full text-left bg-white rounded-3xl px-6 py-4 mb-3 shadow-sm border border-slate-100 active:scale-[0.99] transition hover:shadow-md"
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
          <div className="mt-3 flex items-center justify-between text-[12px] text-slate-400">
            <div>
              {getCurrentTime()}
            </div>
            {/* 显示优先级 */}
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${
                task.priority === "High" ? "bg-red-500" :
                task.priority === "Low" ? "bg-gray-400" : "bg-blue-500"
              }`} />
              <span>{task.priority || "Medium"}</span>
            </div>
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="mt-3 flex justify-end">
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