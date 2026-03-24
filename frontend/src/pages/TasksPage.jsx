import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState(null); // 'date' / 'status'
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEditTask = (id) => {
    navigate(`/tasks/edit/${id}`);
  };

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:4000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:4000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", priority: "Medium", due_date: "" });
    setShowAddForm(false);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    await fetch(`http://localhost:4000/api/tasks/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !currentStatus }),
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterType === "date") {
      if (!selectedDate) return true;
      const taskDate = task.due_date ? task.due_date.slice(0, 10) : null;
      return taskDate === selectedDate;
    }
    if (filterType === "status") {
      if (selectedStatus === "completed") return Boolean(task.completed);
      if (selectedStatus === "pending") return !Boolean(task.completed);
      return true;
    }
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => Boolean(t.completed)).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div style={{ background: 'var(--surface-secondary)', minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl"
                 style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Task Manager
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl"
            style={{
              color: 'var(--text-secondary)',
              background: 'var(--surface-secondary)',
              border: '1.5px solid var(--border)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ── Stats Row ── */}
        <div className="flex gap-4 mb-8">
          <div className="stat-card">
            <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
              {totalTasks}
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Total Tasks
            </div>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>
              {pendingTasks}
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              In Progress
            </div>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
              {completedTasks}
            </div>
            <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Completed
            </div>
          </div>
          {totalTasks > 0 && (
            <div className="stat-card flex flex-col justify-between">
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {Math.round((completedTasks / totalTasks) * 100)}%
              </div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Progress
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((completedTasks / totalTasks) * 100)}%`,
                    background: 'linear-gradient(90deg, #4F6EF7, #10B981)'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Add Task Button ── */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full py-3.5 rounded-2xl text-white text-sm font-semibold mb-6 flex items-center justify-center gap-2 transition-all"
          style={{
            background: showAddForm
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)',
            boxShadow: showAddForm
              ? '0 4px 12px rgba(239,68,68,0.35)'
              : '0 4px 12px rgba(79,110,247,0.35)'
          }}
        >
          {showAddForm ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Add New Task
            </>
          )}
        </button>

        {/* ── Add Task Form ── */}
        {showAddForm && (
          <div className="section-card p-6 mb-6 fade-in-up">
            <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="form-input"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                className="form-input"
                style={{ resize: 'none', lineHeight: '1.6' }}
                rows={3}
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              {/* Priority */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Priority
                </p>
                <div className="flex gap-2">
                  {[
                    { label: "High", color: "#EF4444", bg: "#FEE2E2" },
                    { label: "Medium", color: "#F59E0B", bg: "#FEF3C7" },
                    { label: "Low", color: "#10B981", bg: "#D1FAE5" },
                  ].map(({ label, color, bg }) => {
                    const active = form.priority === label;
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => setForm(prev => ({ ...prev, priority: label }))}
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
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Due Date
                </p>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                Add Task
              </button>
            </form>
          </div>
        )}

        {/* ── Filter Section ── */}
        <div className="section-card p-5 mb-6">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            Filter by
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType("date")}
              className={`filter-chip ${filterType === "date" ? "active" : ""}`}
            >
              📅 Date
            </button>
            <button
              onClick={() => setFilterType("status")}
              className={`filter-chip ${filterType === "status" ? "active" : ""}`}
            >
              ◎ Status
            </button>
            <button
              onClick={() => { setFilterType(null); setSelectedDate(""); setSelectedStatus("all"); }}
              className={`filter-chip ${filterType === null ? "active" : ""}`}
            >
              All Tasks
            </button>
          </div>

          {filterType === "date" && (
            <div className="mt-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
                style={{ maxWidth: '220px' }}
              />
            </div>
          )}

          {filterType === "status" && (
            <div className="mt-3 flex gap-2">
              {["all", "pending", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className="text-sm px-4 py-2 rounded-xl font-medium transition-all"
                  style={{
                    background: selectedStatus === s ? 'var(--brand-primary-light)' : 'var(--surface-secondary)',
                    color: selectedStatus === s ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    border: selectedStatus === s ? '1.5px solid rgba(79,110,247,0.3)' : '1.5px solid var(--border)'
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Task List ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Your Tasks
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--brand-primary-light)', color: 'var(--brand-primary)' }}>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onClick={() => handleEditTask(t.id)}
                onDelete={() => deleteTask(t.id)}
                onToggleStatus={() => toggleTaskStatus(t.id, t.completed)}
              />
            ))}

            {filteredTasks.length === 0 && (
              <div className="empty-state section-card">
                <div className="text-4xl mb-3">📋</div>
                <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  No tasks found
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {filterType ? "Try a different filter" : "Add your first task above"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
