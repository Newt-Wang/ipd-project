import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium", // 默认中等
    due_date: "",
  });
  const [showAddForm, setShowAddForm] = useState(false); // 控制添加任务表单的显示/隐藏

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
    setShowAddForm(false); // 提交后隐藏表单
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

  const setPriority = (level) => {
    setForm((prev) => ({ ...prev, priority: level }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center py-12 px-4">
      {/* 顶部标题和退出按钮 */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          Personal Task Manager
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>

      {/* 添加任务按钮 */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full max-w-2xl py-3 rounded-xl bg-[#0066CC] text-white text-lg font-medium hover:bg-[#0052A3] transition duration-300 active:scale-[0.98] active:translate-y-0.5 mb-6 flex items-center justify-center gap-2"
        style={{
          transform: showAddForm ? 'none' : 'translateY(0)',
          boxShadow: '0 4px 6px -1px rgba(0, 102, 204, 0.3)'
        }}
        onMouseEnter={(e) => {
          if (!showAddForm) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 102, 204, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!showAddForm) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 102, 204, 0.3)';
          }
        }}
      >
        {showAddForm ? (
          <>
            <span>✕</span>
            <span>Cancel</span>
          </>
        ) : (
          <>
            <span className="text-xl">+</span>
            <span>Add New Task</span>
          </>
        )}
      </button>

      {/* 添加任务卡片（可折叠） */}
      {showAddForm && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 transition outline-none"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 transition outline-none"
              rows={3}
              placeholder="Notes (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            {/* Priority Apple 风 segmented 控件 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Priority
              </p>
              <div className="flex bg-gray-100 rounded-full p-1 text-sm font-medium">
                {["High", "Medium", "Low"].map((p) => {
                  const active = form.priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-full transition ${
                        active
                          ? "bg-[#007AFF] text-white shadow-sm"
                          : "text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </p>
              <input
                type="datetime-local"
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 transition outline-none"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#007AFF] text-white text-lg font-medium hover:bg-blue-600 transition active:scale-[0.98]"
            >
              Add Task
            </button>
          </form>
        </div>
      )}

      {/* 任务列表 */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Your Tasks</h2>

        <div className="space-y-6">
          {tasks.map((t) => {
            return (
              <TaskCard
                key={t.id}
                task={t}
                onClick={() => handleEditTask(t.id)}
                onDelete={() => deleteTask(t.id)}
                onToggleStatus={() => toggleTaskStatus(t.id, t.completed)}
              />
            );
          })}

          {tasks.length === 0 && (
            <p className="text-gray-400 text-center mt-10 text-lg">
              No tasks yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}