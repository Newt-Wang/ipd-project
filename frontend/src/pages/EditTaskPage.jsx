import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
    reminder_minutes_before: 0,
  });

  const toDatetimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // 获取现有任务信息
  });

  useEffect(() => {
    fetch(`http://localhost:4000/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((list) => {
        const found = list.find((t) => t.id === Number(id));
        if (found) {
          setTask({
            title: found.title,
            description: found.description || "",
            priority: found.priority || "Medium",
            due_date: toDatetimeLocal(found.due_date),
            reminder_minutes_before: found.reminder_minutes_before || 0,
            due_date: found.due_date || "",
          });
        }
      });
  }, [id]);

  // 保存修改
  const saveTask = () => {
    fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    }).then(() => navigate("/tasks"));
  };

<<<<<<< HEAD
  // 删除任务
=======
>>>>>>> origin/main
  const deleteTask = () => {
    fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/tasks"));
  };

  return (
<<<<<<< HEAD
    <div className="px-6 pt-8 pb-20">
      {/* 顶部 */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-lg">
          Cancel
        </button>
        <button
          onClick={saveTask}
          className="text-blue-500 font-semibold text-lg"
        >
          Save
        </button>
      </div>

      {/* 输入框 */}
      <div className="space-y-4">
        <input
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="Task title"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <textarea
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Notes (optional)"
          className="w-full border px-4 py-3 rounded-xl h-24"
        />

        <div>
          <label className="font-medium">Priority</label>
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            className="w-full border mt-2 px-4 py-3 rounded-xl"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Due Date</label>
          <input
            type="datetime-local"
            value={task.due_date}
            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
            className="w-full border mt-2 px-4 py-3 rounded-xl"
          />
        </div>

        <div>
          <label className="font-medium">Reminder (minutes before due time)</label>
          <input
            type="number"
            min="0"
            value={task.reminder_minutes_before}
            onChange={(e) =>
              setTask({
                ...task,
                reminder_minutes_before: Number(e.target.value || 0),
              })
            }
            className="w-full border mt-2 px-4 py-3 rounded-xl"
          />
        </div>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={deleteTask}
        className="w-full mt-10 bg-red-500 text-white py-3 rounded-xl text-lg"
      >
        Delete Task
      </button>
=======
    <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh' }}>

      {/* ── Top Bar ── */}
      <nav className="navbar">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--surface-secondary)', border: '1.5px solid var(--border)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Edit Task
          </span>

          <button
            onClick={saveTask}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(79,110,247,0.35)'
            }}
          >
            Save
          </button>
        </div>
      </nav>

      {/* ── Form ── */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="section-card p-6 fade-in-up">
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Task Title
              </label>
              <input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task title"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Description
              </label>
              <textarea
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                placeholder="Notes (optional)"
                className="form-input"
                rows={4}
                style={{ resize: 'none', lineHeight: '1.6' }}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Priority
              </label>
              <div className="flex gap-2">
                {[
                  { label: "High",   color: "#EF4444", bg: "#FEE2E2" },
                  { label: "Medium", color: "#F59E0B", bg: "#FEF3C7" },
                  { label: "Low",    color: "#10B981", bg: "#D1FAE5" },
                ].map(({ label, color, bg }) => {
                  const active = task.priority === label;
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => setTask(prev => ({ ...prev, priority: label }))}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: active ? bg : 'var(--surface-secondary)',
                        color: active ? color : 'var(--text-secondary)',
                        border: active ? `1.5px solid ${color}40` : '1.5px solid var(--border)',
                        boxShadow: active ? `0 2px 8px ${color}20` : 'none'
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Due Date
              </label>
              <input
                type="datetime-local"
                value={task.due_date}
                onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* ── Delete ── */}
        <button
          onClick={deleteTask}
          className="w-full mt-5 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            border: '1.5px solid rgba(239,68,68,0.2)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete Task
        </button>
      </div>
>>>>>>> origin/main
    </div>
  );
}
