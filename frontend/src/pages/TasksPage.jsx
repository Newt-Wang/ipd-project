import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    due_date: "",
  });

  const searchParams = new URLSearchParams(location.search);
  const initialFilter = searchParams.get("filter") || null;
  const initialStatus = searchParams.get("status") || "all";
  const initialShowAdd = searchParams.get("action") === "add";

  const [filterType, setFilterType] = useState(initialFilter);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dismissedNotifications") || "[]"); }
    catch { return []; }
  });
  const [showAddForm, setShowAddForm] = useState(initialShowAdd);

  const playClickSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  };

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tasks/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    }
  };

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
    fetchNotifications();
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
    setForm({ title: "", description: "", priority: "Medium", category: "Work", due_date: "" });
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
    if (filterType === "category") {
      if (selectedCategory === "all") return true;
      return task.category === selectedCategory;
    }
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => Boolean(t.completed)).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div style={{ 
      background: isDark ? '#0A0A0A' : '#F9F9FB', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
    }}>

      {/* ── Navbar ── */}
      <nav style={{ 
        background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl" 
                 style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
              Task Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
                style={{
                  color: isDark ? '#F5F5F7' : '#6E6E73',
                  background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  boxShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(40, 40, 40, 0.9)' : 'rgba(243, 244, 246, 0.9)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {notifications.filter(n => !dismissedIds.includes(n.id)).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#EF4444',
                    border: '1.5px solid white'
                  }} />
                )}
              </button>
              {showNotifications && (() => {
                const priorityColor = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };
                const visible = notifications.filter(n => !dismissedIds.includes(n.id));
                const dismissOne = (id) => {
                  const next = [...dismissedIds, id];
                  setDismissedIds(next);
                  localStorage.setItem('dismissedNotifications', JSON.stringify(next));
                };
                const dismissAll = () => {
                  const next = [...dismissedIds, ...visible.map(n => n.id)];
                  setDismissedIds(next);
                  localStorage.setItem('dismissedNotifications', JSON.stringify(next));
                };
                return (
                  <div style={{
                    position: 'absolute',
                    top: '44px',
                    right: 0,
                    width: '340px',
                    background: isDark ? 'rgba(25, 25, 25, 0.97)' : 'rgba(255, 255, 255, 0.97)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
                    border: isDark ? '1px solid rgba(50,50,50,0.6)' : '1px solid rgba(229,229,234,0.6)',
                    zIndex: 200,
                    overflow: 'hidden',
                    maxHeight: '480px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Header */}
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: isDark ? '1px solid rgba(50,50,50,0.6)' : '1px solid #E5E5EA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexShrink: 0
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
                          Overdue Reminders
                        </span>
                        {visible.length > 0 && (
                          <span style={{
                            fontSize: '11px', fontWeight: '600',
                            padding: '2px 7px', borderRadius: '10px',
                            background: '#EF444420', color: '#EF4444'
                          }}>{visible.length}</span>
                        )}
                      </div>
                      {visible.length > 0 && (
                        <button
                          onClick={dismissAll}
                          style={{
                            fontSize: '11px', fontWeight: '500',
                            color: isDark ? '#8E8E93' : '#6E6E73',
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '2px 4px', borderRadius: '4px'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = isDark ? '#8E8E93' : '#6E6E73'; }}
                        >
                          Dismiss all
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                      {visible.length === 0 ? (
                        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
                          <div style={{ fontSize: '13px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
                            No overdue tasks
                          </div>
                        </div>
                      ) : (
                        visible.map(n => {
                          const pColor = priorityColor[n.priority] || '#6E6E73';
                          const overdueDays = Math.floor((Date.now() - new Date(n.created_at)) / 86400000);
                          const dueLabel = n.due_date
                            ? `Due: ${new Date(n.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                            : 'No due date';
                          return (
                            <div key={n.id} style={{
                              padding: '12px 16px',
                              borderBottom: isDark ? '1px solid rgba(50,50,50,0.4)' : '1px solid #F2F2F7',
                            }}>
                              {/* Top row: priority badge + title + dismiss */}
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{
                                  marginTop: '2px', flexShrink: 0,
                                  fontSize: '10px', fontWeight: '600',
                                  padding: '2px 6px', borderRadius: '6px',
                                  background: `${pColor}18`, color: pColor
                                }}>
                                  {n.priority || 'Medium'}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: '13px', fontWeight: '600',
                                    color: isDark ? '#F5F5F7' : '#1D1D1F',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                  }}>
                                    {n.title}
                                  </div>
                                </div>
                                <button
                                  onClick={() => dismissOne(n.id)}
                                  title="Dismiss"
                                  style={{
                                    flexShrink: 0, background: 'none', border: 'none',
                                    cursor: 'pointer', color: isDark ? '#6E6E73' : '#AEAEB2',
                                    padding: '0 2px', lineHeight: 1, fontSize: '16px'
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; }}
                                  onMouseLeave={e => { e.currentTarget.style.color = isDark ? '#6E6E73' : '#AEAEB2'; }}
                                >
                                  ×
                                </button>
                              </div>

                              {/* Description */}
                              {n.description && (
                                <div style={{
                                  fontSize: '12px', marginTop: '6px',
                                  color: isDark ? '#8E8E93' : '#6E6E73',
                                  lineHeight: '1.5',
                                  display: '-webkit-box', WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                }}>
                                  {n.description}
                                </div>
                              )}

                              {/* Meta row */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                <span style={{ fontSize: '11px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
                                  {dueLabel}
                                </span>
                                <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: '500' }}>
                                  Overdue {overdueDays}d
                                </span>
                                <span style={{
                                  fontSize: '11px', marginLeft: 'auto',
                                  color: isDark ? '#8E8E93' : '#6E6E73',
                                  background: isDark ? 'rgba(50,50,50,0.6)' : 'rgba(243,244,246,0.8)',
                                  padding: '1px 6px', borderRadius: '4px'
                                }}>
                                  {n.category}
                                </span>
                              </div>

                              {/* Go to task */}
                              <button
                                onClick={() => { navigate(`/tasks/edit/${n.id}`); setShowNotifications(false); }}
                                style={{
                                  marginTop: '8px', width: '100%',
                                  padding: '6px', borderRadius: '8px',
                                  background: isDark ? 'rgba(40,40,40,0.8)' : 'rgba(243,244,246,0.8)',
                                  border: isDark ? '1px solid rgba(50,50,50,0.6)' : '1px solid #E5E5EA',
                                  color: isDark ? '#F5F5F7' : '#1D1D1F',
                                  fontSize: '12px', fontWeight: '500', cursor: 'pointer'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(50,50,50,0.9)' : 'rgba(229,231,235,0.9)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(40,40,40,0.8)' : 'rgba(243,244,246,0.8)'; }}
                              >
                                View Task →
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              style={{
                color: isDark ? '#F5F5F7' : '#6E6E73',
                background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(40, 40, 40, 0.9)' : 'rgba(243, 244, 246, 0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'; }}
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
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-all"
              style={{
                color: isDark ? '#F5F5F7' : '#6E6E73',
                background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(40, 40, 40, 0.9)' : 'rgba(243, 244, 246, 0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Floating Add Button (Fixed Position) ── */}
      <button
        onClick={() => {
          playClickSound();
          setShowAddForm(!showAddForm);
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          background: showAddForm
            ? '#DC2626'
            : '#5E5CE6',
          color: 'white',
          boxShadow: showAddForm
            ? '0 4px 16px rgba(220, 38, 38, 0.4)'
            : '0 6px 20px rgba(94, 92, 230, 0.45)',
          border: 'none',
          fontSize: '24px',
          fontWeight: 'bold',
          zIndex: 99,
          cursor: 'pointer',
          transform: showAddForm ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = showAddForm ? 'rotate(45deg) scale(1.1)' : 'scale(1.1)';
          e.currentTarget.style.boxShadow = showAddForm
            ? '0 6px 24px rgba(220, 38, 38, 0.5)'
            : '0 8px 28px rgba(94, 92, 230, 0.55)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = showAddForm ? 'rotate(45deg) scale(1)' : 'scale(1)';
          e.currentTarget.style.boxShadow = showAddForm
            ? '0 4px 16px rgba(220, 38, 38, 0.4)'
            : '0 6px 20px rgba(94, 92, 230, 0.45)';
        }}
        aria-label={showAddForm ? "Cancel" : "Add New Task"}
      >
        +
      </button>

      <div className="w-full px-4 py-4">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          <div style={{ 
            background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 14px',
            boxShadow: isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease',
            border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)';
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#5E5CE6' }}>
              {totalTasks}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '500', marginTop: '2px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
              Total
            </div>
          </div>
          <div style={{ 
            background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 14px',
            boxShadow: isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease',
            border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)';
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B' }}>
              {pendingTasks}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '500', marginTop: '2px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
              In Progress
            </div>
          </div>
          <div style={{ 
            background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 14px',
            boxShadow: isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease',
            border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)';
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#34C759' }}>
              {completedTasks}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '500', marginTop: '2px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
              Completed
            </div>
          </div>
          {totalTasks > 0 && (
            <div style={{ 
              background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px 14px',
              boxShadow: isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease',
              border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDark ? '0 2px 6px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.06)';
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
                {Math.round((completedTasks / totalTasks) * 100)}%
              </div>
              <div style={{ fontSize: '11px', fontWeight: '500', marginBottom: '6px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
                Progress
              </div>
              <div className="w-full h-1 rounded-full" style={{ background: isDark ? '#333333' : '#E5E5EA' }}>
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((completedTasks / totalTasks) * 100)}%`,
                    background: 'linear-gradient(90deg, #5E5CE6, #34C759)'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Add Task Form ── */}
        {showAddForm && (
          <>
            {/* Background Overlay */}
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(2px)',
                zIndex: 999
              }}
              onClick={() => {
                playClickSound();
                setShowAddForm(false);
              }}
            />
            
            {/* Form Container */}
            <div style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '500px',
              background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
              border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)',
              zIndex: 1000
            }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
              New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                  fontSize: '14px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif',
                  background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'white',
                  color: isDark ? '#F5F5F7' : '#1D1D1F'
                }}
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                  fontSize: '14px',
                  resize: 'none',
                  lineHeight: '1.6',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif',
                  background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'white',
                  color: isDark ? '#F5F5F7' : '#1D1D1F'
                }}
                rows={3}
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              {/* Priority */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: isDark ? '#8E8E93' : '#6E6E73' }}>
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
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          background: active ? bg : (isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                          color: active ? color : (isDark ? '#F5F5F7' : '#6E6E73'),
                          border: active ? `1.5px solid ${color}40` : (isDark ? '1.5px solid rgba(50, 50, 50, 0.6)' : '1.5px solid #E5E5EA'),
                          boxShadow: active ? `0 2px 8px ${color}20` : 'none',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
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
                <p className="text-sm font-medium mb-2" style={{ color: isDark ? '#8E8E93' : '#6E6E73' }}>
                  Category
                </p>
                <div className="flex gap-2">
                  {[
                    { label: "Work",  color: "#4F6EF7", bg: "#EEF1FE" },
                    { label: "Study", color: "#7C3AED", bg: "#F5F3FF" },
                    { label: "Life",  color: "#10B981", bg: "#D1FAE5" },
                  ].map(({ label, color, bg }) => {
                    const active = form.category === label;
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => setForm(prev => ({ ...prev, category: label }))}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          background: active ? bg : (isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                          color: active ? color : (isDark ? '#F5F5F7' : '#6E6E73'),
                          border: active ? `1.5px solid ${color}40` : (isDark ? '1.5px solid rgba(50, 50, 50, 0.6)' : '1.5px solid #E5E5EA'),
                          boxShadow: active ? `0 2px 8px ${color}20` : 'none',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
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
                <p className="text-sm font-medium mb-2" style={{ color: isDark ? '#8E8E93' : '#6E6E73' }}>
                  Due Date
                </p>
                <input
                  type="datetime-local"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                    fontSize: '14px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif',
                    background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'white',
                    color: isDark ? '#F5F5F7' : '#1D1D1F'
                  }}
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowAddForm(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(243, 244, 246, 0.8)',
                    color: isDark ? '#F5F5F7' : '#6E6E73',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? 'rgba(50, 50, 50, 0.9)' : 'rgba(229, 231, 235, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(243, 244, 246, 0.8)';
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#5E5CE6',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(94, 92, 230, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
          </>
        )}

        {/* ── Filter Section ── */}
        <div style={{ marginBottom: '20px' }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            gap: '6px',
            background: isDark ? 'rgba(30,30,30,0.9)' : 'rgba(0,0,0,0.05)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '12px'
          }}>
            {[
              { key: null,       label: 'All Tasks',  icon: '⊞' },
              { key: 'status',   label: 'Status',     icon: '◎' },
              { key: 'category', label: 'Category',   icon: '◈' },
              { key: 'date',     label: 'Date',       icon: '📅' },
            ].map(({ key, label, icon }) => {
              const active = filterType === key;
              return (
                <button
                  key={String(key)}
                  onClick={() => { setFilterType(key); setSelectedDate(''); setSelectedStatus('all'); setSelectedCategory('all'); }}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: active ? '600' : '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: active ? (isDark ? '#2A2A2A' : '#FFFFFF') : 'transparent',
                    color: active ? (isDark ? '#F5F5F7' : '#1D1D1F') : (isDark ? '#8E8E93' : '#6E6E73'),
                    boxShadow: active ? (isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.12)') : 'none',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {icon} {label}
                </button>
              );
            })}
          </div>

          {/* Sub-filters */}
          {filterType === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: isDark ? '1px solid rgba(50,50,50,0.6)' : '1px solid #E5E5EA',
                fontSize: '13px',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                background: isDark ? 'rgba(20,20,20,0.8)' : 'white',
                color: isDark ? '#F5F5F7' : '#1D1D1F'
              }}
            />
          )}

          {filterType === 'status' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 'all',       label: 'All',       color: '#5E5CE6' },
                { val: 'pending',   label: 'Pending',   color: '#F59E0B' },
                { val: 'completed', label: 'Completed', color: '#34C759' },
              ].map(({ val, label, color }) => (
                <button
                  key={val}
                  onClick={() => setSelectedStatus(val)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    border: selectedStatus === val ? `1.5px solid ${color}` : (isDark ? '1.5px solid rgba(50,50,50,0.6)' : '1.5px solid #E5E5EA'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: selectedStatus === val ? `${color}15` : (isDark ? 'rgba(30,30,30,0.8)' : 'white'),
                    color: selectedStatus === val ? color : (isDark ? '#8E8E93' : '#6E6E73'),
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {filterType === 'category' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 'all',   label: 'All',   color: '#5E5CE6', bg: '#EEF1FE' },
                { val: 'Work',  label: 'Work',  color: '#4F6EF7', bg: '#EEF1FE' },
                { val: 'Study', label: 'Study', color: '#7C3AED', bg: '#F5F3FF' },
                { val: 'Life',  label: 'Life',  color: '#10B981', bg: '#D1FAE5' },
              ].map(({ val, label, color, bg }) => (
                <button
                  key={val}
                  onClick={() => setSelectedCategory(val)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    border: selectedCategory === val ? `1.5px solid ${color}` : (isDark ? '1.5px solid rgba(50,50,50,0.6)' : '1.5px solid #E5E5EA'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: selectedCategory === val ? (isDark ? `${color}25` : bg) : (isDark ? 'rgba(30,30,30,0.8)' : 'white'),
                    color: selectedCategory === val ? color : (isDark ? '#8E8E93' : '#6E6E73'),
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Task List ── */}
        <div>
          {/* ── Date: Timeline view ── */}
          {filterType === "date" ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
                  Timeline
                </h2>
                <span style={{
                  fontSize: '12px', fontWeight: '600', padding: '3px 10px',
                  borderRadius: '12px', background: 'rgba(94,92,230,0.1)', color: '#5E5CE6'
                }}>
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ position: 'relative', paddingLeft: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                  position: 'absolute', left: '15px', top: '0', bottom: '0',
                  width: '2px', background: isDark ? 'rgba(50,50,50,0.6)' : 'rgba(229,229,234,0.8)'
                }} />
                {filteredTasks
                  .sort((a, b) => {
                    const dateA = a.due_date ? new Date(a.due_date) : new Date(0);
                    const dateB = b.due_date ? new Date(b.due_date) : new Date(0);
                    return dateA - dateB;
                  })
                  .map((t) => {
                    const taskDate = t.due_date ? new Date(t.due_date) : null;
                    const formattedDate = taskDate ? taskDate.toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'No Due Date';
                    const priorityColors = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };
                    const priorityColor = priorityColors[t.priority] || '#6E6E73';
                    return (
                      <div key={t.id} style={{
                        position: 'relative', marginBottom: '16px', padding: '16px',
                        background: isDark ? 'rgba(30,30,30,0.95)' : '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                        borderLeft: `3px solid ${priorityColor}`,
                        transition: 'all 0.15s ease', cursor: 'pointer',
                        opacity: t.completed ? 0.55 : 1
                      }}
                      onClick={() => handleEditTask(t.id)}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)'; }}>
                        <div style={{ position: 'absolute', left: '-33px', top: '18px', width: '16px', height: '16px', borderRadius: '50%', background: priorityColor, border: `3px solid ${isDark ? '#0A0A0A' : '#F9F9FB'}`, boxShadow: `0 0 0 2px ${priorityColor}40` }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: isDark ? '#F5F5F7' : '#1D1D1F', textDecoration: t.completed ? 'line-through' : 'none' }}>
                              {t.title}
                            </h3>
                            {t.description && (
                              <p style={{ fontSize: '12px', color: isDark ? '#8E8E93' : '#6E6E73', lineHeight: '1.5', marginBottom: '8px' }}>
                                {t.description}
                              </p>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px', background: `${priorityColor}18`, color: priorityColor }}>
                                {t.priority}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: '500', padding: '2px 8px', borderRadius: '6px', background: isDark ? 'rgba(50,50,50,0.6)' : '#F3F4F6', color: isDark ? '#F5F5F7' : '#6E6E73' }}>
                                {t.category}
                              </span>
                              <span style={{ fontSize: '11px', color: isDark ? '#8E8E93' : '#6E6E73' }}>📅 {formattedDate}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                            <button onClick={(e) => { e.stopPropagation(); toggleTaskStatus(t.id, t.completed); }}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: t.completed ? 'none' : (isDark ? '1.5px solid rgba(50,50,50,0.6)' : '1.5px solid #E5E5EA'), background: t.completed ? '#34C759' : 'transparent', color: t.completed ? 'white' : (isDark ? '#8E8E93' : '#6E6E73'), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              {t.completed
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/></svg>}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this task?')) deleteTask(t.id); }}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: isDark ? '1.5px solid rgba(50,50,50,0.6)' : '1.5px solid #E5E5EA', background: 'transparent', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {filteredTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: isDark ? 'rgba(30,30,30,0.9)' : '#FFFFFF', borderRadius: '12px', boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>📅</div>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: isDark ? '#8E8E93' : '#6E6E73' }}>No tasks for this date</p>
                  </div>
                )}
              </div>
            </div>

          ) : (
            /* ── All / Status / Category: Kanban 2-column ── */
            (() => {
              const pending   = filteredTasks.filter(t => !Boolean(t.completed));
              const completed = filteredTasks.filter(t => Boolean(t.completed));

              const colConfig = [
                {
                  tasks: pending,
                  label: 'Pending',
                  count: pending.length,
                  accentColor: '#F59E0B',
                  headerBg: isDark ? 'rgba(245,158,11,0.12)' : '#FFFBEB',
                  headerBorder: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
                  emptyIcon: '📋',
                  emptyText: 'No pending tasks',
                },
                {
                  tasks: completed,
                  label: 'Completed',
                  count: completed.length,
                  accentColor: '#34C759',
                  headerBg: isDark ? 'rgba(52,199,89,0.10)' : '#F0FDF4',
                  headerBorder: isDark ? 'rgba(52,199,89,0.22)' : '#BBF7D0',
                  emptyIcon: '✓',
                  emptyText: 'Nothing completed yet',
                },
              ];

              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
                  {colConfig.map(col => (
                    <div key={col.label} style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: isDark ? 'rgba(20,20,20,0.6)' : 'rgba(0,0,0,0.03)',
                      border: isDark ? '1px solid rgba(50,50,50,0.5)' : '1px solid rgba(0,0,0,0.07)',
                    }}>
                      {/* Column header */}
                      <div style={{
                        padding: '10px 14px',
                        background: col.headerBg,
                        borderBottom: `1px solid ${col.headerBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.accentColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: col.accentColor, letterSpacing: '0.3px' }}>
                          {col.label}
                        </span>
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '11px', fontWeight: '700',
                          padding: '1px 8px', borderRadius: '10px',
                          background: `${col.accentColor}20`,
                          color: col.accentColor
                        }}>
                          {col.count}
                        </span>
                      </div>

                      {/* Cards */}
                      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px' }}>
                        {col.tasks.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '28px 0', color: isDark ? '#6E6E73' : '#AEAEB2' }}>
                            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{col.emptyIcon}</div>
                            <div style={{ fontSize: '12px' }}>{col.emptyText}</div>
                          </div>
                        ) : (
                          col.tasks.map(t => (
                            <TaskCard
                              key={t.id}
                              task={t}
                              onClick={() => handleEditTask(t.id)}
                              onDelete={() => deleteTask(t.id)}
                              onToggleStatus={() => toggleTaskStatus(t.id, t.completed)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
