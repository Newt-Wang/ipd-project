import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSound } from "../hooks/useSound";

export default function HomePage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const playClickSound = useSound();
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchTasks = async () => {
    if (!token) {
      setTasks([]);
      setLoadError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to load tasks");
      }

      setTasks(Array.isArray(data) ? data : []);
      setLoadError("");
    } catch (err) {
      setTasks([]);
      setLoadError(err.message || "Unable to load your latest task summary.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const isDueToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
  };

  const formatDueLabel = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => Boolean(task.completed)).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter((task) => {
    if (!task.due_date || task.completed) return false;
    return new Date(task.due_date) < new Date();
  }).length;
  const todayTasks = tasks.filter((task) => !Boolean(task.completed) && isDueToday(task.due_date)).length;
  const highPriorityTasks = tasks.filter((task) => !Boolean(task.completed) && task.priority === "High").length;
  const activeCategories = new Set(tasks.map((task) => task.category).filter(Boolean)).size;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const nextDueTask = [...tasks]
    .filter((task) => !Boolean(task.completed) && task.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0] || null;

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "My Tasks",
      description: isLoading
        ? "Loading your task list..."
        : totalTasks > 0
          ? `Review all ${totalTasks} task${totalTasks !== 1 ? "s" : ""} and keep your workflow moving.`
          : "Create your first task and start building momentum.",
      badge: isLoading ? "..." : `${totalTasks} total`,
      color: "#4F6EF7",
      route: "/tasks",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Pending Reminders",
      description: isLoading
        ? "Preparing your latest task status..."
        : overdueTasks > 0
          ? `${overdueTasks} overdue task${overdueTasks !== 1 ? "s" : ""} need attention first.`
          : `${pendingTasks} task${pendingTasks !== 1 ? "s" : ""} are still in progress.`,
      badge: isLoading ? "..." : overdueTasks > 0 ? `${overdueTasks} overdue` : `${pendingTasks} pending`,
      color: "#F59E0B",
      route: "/tasks?filter=status&status=pending",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Filter by Category",
      description: isLoading
        ? "Loading category summary..."
        : activeCategories > 0
          ? `${activeCategories} categor${activeCategories === 1 ? "y is" : "ies are"} active in your current task set.`
          : "Organize tasks by Work, Study, and Life to find them faster.",
      badge: isLoading ? "..." : `${activeCategories} groups`,
      color: "#10B981",
      route: "/tasks?filter=category",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "View by Date",
      description: isLoading
        ? "Loading today's schedule..."
        : todayTasks > 0
          ? `${todayTasks} task${todayTasks !== 1 ? "s" : ""} are due today.`
          : "Browse your timeline and plan upcoming deadlines with confidence.",
      badge: isLoading ? "..." : `${todayTasks} today`,
      color: "#7C3AED",
      route: "/tasks?filter=date",
    },
  ];

  const overviewCards = [
    { label: "Total Tasks", value: totalTasks, color: "#4F6EF7" },
    { label: "Pending", value: pendingTasks, color: "#F59E0B" },
    { label: "Completed", value: completedTasks, color: "#34C759" },
    { label: "Overdue", value: overdueTasks, color: "#EF4444" },
  ];

  const overviewHighlights = [
    {
      label: "Next up",
      value: nextDueTask ? nextDueTask.title : "No upcoming deadline",
      detail: nextDueTask ? formatDueLabel(nextDueTask.due_date) : "Add a due date to see what is next",
    },
    {
      label: "High priority",
      value: `${highPriorityTasks} pending`,
      detail: highPriorityTasks > 0 ? "Review these first" : "No urgent backlog right now",
    },
    {
      label: "Completion rate",
      value: `${completionRate}% complete`,
      detail: totalTasks > 0 ? `${completedTasks} of ${totalTasks} tasks finished` : "Your progress will appear here",
    },
  ];

  return (
    <div style={{
      background: isDark ? "#0A0A0A" : "#F9F9FB",
      minHeight: "100vh",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
    }}>
      <nav style={{
        background: isDark ? "rgba(20, 20, 20, 0.8)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
        boxShadow: isDark ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl"
                 style={{ background: "linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: isDark ? "#F5F5F7" : "#1D1D1F" }}>
              Task Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { playClickSound(); toggleTheme(); }}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              style={{
                color: isDark ? "#F5F5F7" : "#6E6E73",
                background: isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)",
                boxShadow: isDark ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(40, 40, 40, 0.9)" : "rgba(243, 244, 246, 0.9)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"; }}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => { playClickSound(); handleLogout(); }}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all"
              style={{
                color: isDark ? "#F5F5F7" : "#6E6E73",
                background: isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)",
                boxShadow: isDark ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(40, 40, 40, 0.9)" : "rgba(243, 244, 246, 0.9)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
               style={{ background: "linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: isDark ? "#F5F5F7" : "#1D1D1F" }}>
            Welcome back
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: isDark ? "#8E8E93" : "#6E6E73" }}>
            {isLoading
              ? "Loading your latest task snapshot..."
              : loadError
                ? "Your workspace is ready, but the latest task summary could not be loaded right now."
                : totalTasks > 0
                  ? `You have ${pendingTasks} pending task${pendingTasks !== 1 ? "s" : ""}, ${completedTasks} completed, and ${overdueTasks} overdue.`
                  : "You are all caught up. Create a task to start planning your next step."}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => { playClickSound(); navigate("/tasks"); }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)",
                color: "white",
                boxShadow: "0 4px 16px rgba(79, 110, 247, 0.35)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(79, 110, 247, 0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(79, 110, 247, 0.35)";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Go to My Tasks
            </button>
            <button
              onClick={() => { playClickSound(); navigate("/tasks?action=add"); }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all"
              style={{
                background: isDark ? "rgba(40, 40, 40, 0.8)" : "rgba(243, 244, 246, 0.8)",
                color: isDark ? "#F5F5F7" : "#1D1D1F",
                border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? "rgba(50, 50, 50, 0.9)" : "rgba(229, 231, 235, 0.9)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? "rgba(40, 40, 40, 0.8)" : "rgba(243, 244, 246, 0.8)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Create Task
            </button>
          </div>
          {!isLoading && !loadError && (
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Pending", value: pendingTasks, color: "#F59E0B" },
                { label: "Overdue", value: overdueTasks, color: "#EF4444" },
                { label: "Due Today", value: todayTasks, color: "#7C3AED" },
                { label: "Completion", value: `${completionRate}%`, color: "#34C759" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    background: isDark ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.95)",
                    border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)",
                    boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  <span style={{ color: item.color, fontWeight: "700", marginRight: "6px" }}>{item.value}</span>
                  <span style={{ color: isDark ? "#8E8E93" : "#6E6E73", fontSize: "13px" }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl transition-all cursor-pointer"
              style={{
                background: isDark ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: isDark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)",
                cursor: "pointer"
              }}
              onClick={() => { playClickSound(); navigate(feature.route); }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = isDark ? "0 8px 24px rgba(0, 0, 0, 0.4)" : "0 8px 24px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.06)";
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color
                  }}
                >
                  {feature.icon}
                </div>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: `${feature.color}15`,
                  color: feature.color,
                  fontSize: "12px",
                  fontWeight: "700"
                }}>
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: isDark ? "#F5F5F7" : "#1D1D1F" }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: isDark ? "#8E8E93" : "#6E6E73" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="p-8 rounded-2xl"
          style={{
            background: isDark ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: isDark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.06)",
            border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)"
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: isDark ? "#F5F5F7" : "#1D1D1F" }}>
                Live Overview
              </h2>
              <p className="text-sm mt-1" style={{ color: isDark ? "#8E8E93" : "#6E6E73" }}>
                A quick snapshot of your real task data.
              </p>
            </div>
            <button
              onClick={() => { playClickSound(); fetchTasks(); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
              style={{
                background: isDark ? "rgba(40, 40, 40, 0.8)" : "rgba(243, 244, 246, 0.8)",
                color: isDark ? "#F5F5F7" : "#1D1D1F",
                border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)",
                fontWeight: "600"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div style={{
              padding: "28px",
              borderRadius: "18px",
              background: isDark ? "rgba(20,20,20,0.8)" : "rgba(248,250,255,0.9)",
              color: isDark ? "#8E8E93" : "#6E6E73",
              textAlign: "center"
            }}>
              Loading your task summary...
            </div>
          ) : loadError ? (
            <div style={{
              padding: "24px",
              borderRadius: "18px",
              background: isDark ? "rgba(239,68,68,0.12)" : "#FEF2F2",
              border: "1px solid rgba(239,68,68,0.18)",
              color: isDark ? "#FCA5A5" : "#B91C1C"
            }}>
              <div className="text-base font-semibold mb-1">Unable to load overview</div>
              <div className="text-sm">{loadError}</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {overviewCards.map((card) => (
                  <div
                    key={card.label}
                    style={{
                      padding: "18px",
                      borderRadius: "16px",
                      background: isDark ? "rgba(20,20,20,0.8)" : "rgba(248,250,255,0.95)",
                      border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)"
                    }}
                  >
                    <div style={{ fontSize: "28px", fontWeight: "800", color: card.color }}>{card.value}</div>
                    <div style={{ fontSize: "13px", color: isDark ? "#8E8E93" : "#6E6E73" }}>{card.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {overviewHighlights.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "18px",
                      borderRadius: "16px",
                      background: isDark ? "rgba(20,20,20,0.8)" : "rgba(248,250,255,0.95)",
                      border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)"
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: "700", color: isDark ? "#8E8E93" : "#6E6E73", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "17px", fontWeight: "700", color: isDark ? "#F5F5F7" : "#1D1D1F", marginBottom: "6px" }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: "13px", color: isDark ? "#8E8E93" : "#6E6E73" }}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: "18px",
                borderRadius: "16px",
                background: isDark ? "rgba(20,20,20,0.8)" : "rgba(248,250,255,0.95)",
                border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)"
              }}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: isDark ? "#F5F5F7" : "#1D1D1F", marginBottom: "4px" }}>
                      Keep moving
                    </div>
                    <div style={{ fontSize: "13px", color: isDark ? "#8E8E93" : "#6E6E73" }}>
                      Jump straight to the view you need next.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => { playClickSound(); navigate("/tasks?action=add"); }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "none",
                        background: "#5E5CE6",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => { playClickSound(); navigate("/tasks?filter=status&status=pending"); }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)",
                        background: isDark ? "rgba(30,30,30,0.8)" : "white",
                        color: isDark ? "#F5F5F7" : "#1D1D1F",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Open Pending
                    </button>
                    <button
                      onClick={() => { playClickSound(); navigate("/tasks?filter=date"); }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: isDark ? "1px solid rgba(50, 50, 50, 0.6)" : "1px solid rgba(229, 229, 234, 0.6)",
                        background: isDark ? "rgba(30,30,30,0.8)" : "white",
                        color: isDark ? "#F5F5F7" : "#1D1D1F",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Open Timeline
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="py-8 text-center" style={{ color: isDark ? "#6E6E73" : "#8E8E93" }}>
        <p className="text-sm">
          © 2026 Task Manager. Built with React & Node.js
        </p>
      </footer>
    </div>
  );
}
