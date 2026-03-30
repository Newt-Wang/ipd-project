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
    category: "Work",
    due_date: "",
    reminder_at: "",
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
            category: found.category || "Work",
            due_date: found.due_date || "",
            reminder_at: found.reminder_at || "",
          });
        }
      });
  }, [id]);

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

  const deleteTask = () => {
    fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/tasks"));
  };

  return (
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Category
              </label>
              <div className="flex gap-2">
                {[
                  { label: "Work",  color: "#4F6EF7", bg: "#EEF1FE" },
                  { label: "Study", color: "#7C3AED", bg: "#F5F3FF" },
                  { label: "Life",  color: "#10B981", bg: "#D1FAE5" },
                ].map(({ label, color, bg }) => {
                  const active = task.category === label;
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => setTask(prev => ({ ...prev, category: label }))}
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

            {/* Reminder */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Reminder
              </label>
              <input
                type="datetime-local"
                value={task.reminder_at}
                onChange={(e) => setTask({ ...task, reminder_at: e.target.value })}
                className="form-input"
              />
              <p style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-tertiary)' }}>
                You'll get a browser notification at this time
              </p>
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
    </div>
  );
}
