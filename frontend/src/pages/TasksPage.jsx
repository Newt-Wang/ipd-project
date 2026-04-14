import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import TaskCard from "../components/TaskCard";

export default function TasksPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    due_date: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState(null); // 'date' / 'status' / 'category'
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
            {/* Home Button */}
            <button
              onClick={() => navigate("/home")}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              style={{
                color: isDark ? '#F5F5F7' : '#6E6E73',
                background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(40, 40, 40, 0.9)' : 'rgba(243, 244, 246, 0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'; }}
              title="Go to Home"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
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
                {notifications.length > 0 && (
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
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '44px',
                  right: 0,
                  width: '280px',
                  background: isDark ? 'rgba(25, 25, 25, 0.97)' : 'rgba(255, 255, 255, 0.97)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
                  border: isDark ? '1px solid rgba(50,50,50,0.6)' : '1px solid rgba(229,229,234,0.6)',
                  zIndex: 200,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: isDark ? '1px solid rgba(50,50,50,0.6)' : '1px solid #E5E5EA' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
                      Overdue Reminders
                    </span>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '13px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
                      No overdue tasks
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{
                        padding: '10px 16px',
                        borderBottom: isDark ? '1px solid rgba(50,50,50,0.4)' : '1px solid #F2F2F7',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ color: '#EF4444', fontSize: '14px', marginTop: '1px' }}>●</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '500', color: isDark ? '#F5F5F7' : '#1D1D1F' }}>{n.title}</div>
                          <div style={{ fontSize: '11px', color: isDark ? '#8E8E93' : '#6E6E73', marginTop: '2px' }}>
                            Pending for over 1 day
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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
        <div style={{ 
          background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
        }}>
          <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: isDark ? '#8E8E93' : '#6E6E73' }}>
            Filter by
          </p>
          
          {/* Segmented Control */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            paddingBottom: '12px',
            borderBottom: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
            marginBottom: '16px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <button
              onClick={() => { setFilterType(null); setSelectedDate(""); setSelectedStatus("all"); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                background: filterType === null ? 'rgba(94, 92, 230, 0.1)' : 'transparent',
                color: filterType === null ? '#5E5CE6' : (isDark ? '#F5F5F7' : '#6E6E73'),
                border: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              All Tasks
              {filterType === null && (
                <div style={{
                  position: 'absolute',
                  bottom: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  background: '#5E5CE6',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}/>
              )}
            </button>
            <button
              onClick={() => setFilterType("date")}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                background: filterType === "date" ? 'rgba(94, 92, 230, 0.1)' : 'transparent',
                color: filterType === "date" ? '#5E5CE6' : (isDark ? '#F5F5F7' : '#6E6E73'),
                border: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              📅 Date
              {filterType === "date" && (
                <div style={{
                  position: 'absolute',
                  bottom: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  background: '#5E5CE6',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}/>
              )}
            </button>
            <button
              onClick={() => setFilterType("status")}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                background: filterType === "status" ? 'rgba(94, 92, 230, 0.1)' : 'transparent',
                color: filterType === "status" ? '#5E5CE6' : (isDark ? '#F5F5F7' : '#6E6E73'),
                border: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              ◎ Status
              {filterType === "status" && (
                <div style={{
                  position: 'absolute',
                  bottom: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  background: '#5E5CE6',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}/>
              )}
            </button>
            <button
              onClick={() => setFilterType("category")}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                background: filterType === "category" ? 'rgba(94, 92, 230, 0.1)' : 'transparent',
                color: filterType === "category" ? '#5E5CE6' : (isDark ? '#F5F5F7' : '#6E6E73'),
                border: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              ◈ Category
              {filterType === "category" && (
                <div style={{
                  position: 'absolute',
                  bottom: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '3px',
                  background: '#5E5CE6',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}/>
              )}
            </button>

          </div>

          {filterType === "date" && (
            <div style={{ marginTop: '12px' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  maxWidth: '220px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                  fontSize: '14px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif',
                  background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'white',
                  color: isDark ? '#F5F5F7' : '#1D1D1F'
                }}
              />
            </div>
          )}

          {filterType === "status" && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              {["all", "pending", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    background: selectedStatus === s ? 'rgba(94, 92, 230, 0.1)' : (isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                    color: selectedStatus === s ? '#5E5CE6' : (isDark ? '#F5F5F7' : '#6E6E73'),
                    border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}

          {filterType === "category" && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              {[
                { label: "all",   display: "All",   color: '#5E5CE6' },
                { label: "Work",  display: "Work",  color: '#4F6EF7' },
                { label: "Study", display: "Study", color: '#7C3AED' },
                { label: "Life",  display: "Life",  color: '#10B981' },
              ].map(({ label, display, color }) => (
                <button
                  key={label}
                  onClick={() => setSelectedCategory(label)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    background: selectedCategory === label ? `${color}18` : (isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                    color: selectedCategory === label ? color : (isDark ? '#F5F5F7' : '#6E6E73'),
                    border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid #E5E5EA',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
                  }}
                >
                  {display}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Task List ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
              Your Tasks
            </h2>
            <span style={{ 
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '12px',
              background: 'rgba(94, 92, 230, 0.1)',
              color: '#5E5CE6',
              boxShadow: '0 2px 6px rgba(94, 92, 230, 0.12)'
            }}>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Timeline View for Date Filter */}
          {filterType === "date" ? (
            <div style={{ 
              position: 'relative',
              paddingLeft: '40px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {/* Timeline Line */}
              <div style={{
                position: 'absolute',
                left: '15px',
                top: '0',
                bottom: '0',
                width: '2px',
                background: isDark ? 'rgba(50, 50, 50, 0.6)' : 'rgba(229, 229, 234, 0.8)'
              }} />

              {filteredTasks
                .sort((a, b) => {
                  // Sort by due date, with earlier dates first
                  const dateA = a.due_date ? new Date(a.due_date) : new Date(0);
                  const dateB = b.due_date ? new Date(b.due_date) : new Date(0);
                  return dateA - dateB;
                })
                .map((t, index) => {
                  const taskDate = t.due_date ? new Date(t.due_date) : null;
                  const formattedDate = taskDate ? taskDate.toLocaleString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'No Due Date';
                  
                  // Get priority color
                  const priorityColors = {
                    High: '#EF4444',
                    Medium: '#F59E0B',
                    Low: '#10B981'
                  };
                  const priorityColor = priorityColors[t.priority] || '#6E6E73';

                  return (
                    <div key={t.id} style={{
                      position: 'relative',
                      marginBottom: '32px',
                      padding: '20px',
                      background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
                      border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleEditTask(t.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = isDark ? '0 6px 16px rgba(0, 0, 0, 0.5)' : '0 6px 16px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }}>
                      {/* Timeline Dot */}
                      <div style={{
                        position: 'absolute',
                        left: '-40px',
                        top: '24px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: priorityColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 8px ${priorityColor}40`,
                        border: '3px solid' + (isDark ? '#0A0A0A' : '#F9F9FB')
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      
                      {/* Task Content */}
                      <div className="flex justify-between items-start">
                        <div style={{ flex: 1, marginRight: '16px' }}>
                          <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            color: isDark ? '#F5F5F7' : '#1D1D1F',
                            textDecoration: t.completed ? 'line-through' : 'none',
                            opacity: t.completed ? 0.6 : 1
                          }}>
                            {t.title}
                          </h3>
                          {t.description && (
                            <p style={{ 
                              fontSize: '14px', 
                              marginBottom: '12px',
                              color: isDark ? '#8E8E93' : '#6E6E73',
                              lineHeight: '1.5',
                              opacity: t.completed ? 0.6 : 1
                            }}>
                              {t.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span style={{ 
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: `${priorityColor}15`,
                              color: priorityColor
                            }}>
                              {t.priority}
                            </span>
                            <span style={{ 
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: isDark ? 'rgba(50, 50, 50, 0.6)' : 'rgba(243, 244, 246, 0.8)',
                              color: isDark ? '#F5F5F7' : '#6E6E73'
                            }}>
                              {t.category}
                            </span>
                            <span style={{ 
                              fontSize: '12px',
                              fontWeight: '500',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: isDark ? 'rgba(50, 50, 50, 0.6)' : 'rgba(243, 244, 246, 0.8)',
                              color: isDark ? '#F5F5F7' : '#6E6E73'
                            }}>
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskStatus(t.id, t.completed);
                            }}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              border: t.completed ? 'none' : (isDark ? '1.5px solid rgba(50, 50, 50, 0.6)' : '1.5px solid #E5E5EA'),
                              background: t.completed ? '#34C759' : (isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                              color: t.completed ? 'white' : (isDark ? '#8E8E93' : '#6E6E73'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {t.completed ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                deleteTask(t.id);
                              }
                            }}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              border: isDark ? '1.5px solid rgba(50, 50, 50, 0.6)' : '1.5px solid #E5E5EA',
                              background: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                              color: '#EF4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                              e.currentTarget.style.background = '#FEE2E2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.background = isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)';
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {filteredTasks.length === 0 && (
                <div style={{ 
                  position: 'relative',
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
                }}>
                  <div className="text-4xl mb-3">📅</div>
                  <p className="font-semibold text-sm" style={{ color: isDark ? '#F5F5F7' : '#6E6E73' }}>
                    No tasks found for this date
                  </p>
                  <p className="text-xs mt-1" style={{ color: isDark ? '#8E8E93' : '#8E8E93' }}>
                    Try selecting a different date or add a new task
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Grid View for other filters */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                <div className="col-span-full" style={{ 
                  background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
                }}>
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-semibold text-sm" style={{ color: isDark ? '#F5F5F7' : '#6E6E73' }}>
                    No tasks found
                  </p>
                  <p className="text-xs mt-1" style={{ color: isDark ? '#8E8E93' : '#8E8E93' }}>
                    {filterType ? "Try a different filter" : "Add your first task by clicking the + button"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
