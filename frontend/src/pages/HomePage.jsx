import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "我的任务",
      description: "查看所有任务，添加、编辑和管理你的待办事项，轻松追踪进度。",
      color: "#4F6EF7",
      route: "/tasks"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "待办提醒",
      description: "查看所有未完成任务，及时处理逾期事项，不错过任何重要截止日期。",
      color: "#F59E0B",
      route: "/tasks?filter=status&status=pending"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "按类别筛选",
      description: "按工作、学习、生活三大类别整理和筛选任务，快速定位你需要的内容。",
      color: "#10B981",
      route: "/tasks?filter=category"
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "按日期查看",
      description: "以时间轴视图浏览任务，选择特定日期查看当天的所有安排。",
      color: "#7C3AED",
      route: "/tasks?filter=date"
    }
  ];

  return (
    <div style={{ 
      background: isDark ? '#0A0A0A' : '#F9F9FB', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "San Francisco", "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Navbar */}
      <nav style={{ 
        background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
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

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
               style={{ background: 'linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
            Welcome to Task Manager
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: isDark ? '#8E8E93' : '#6E6E73' }}>
            Your personal productivity companion. Organize your work, track your progress, and achieve your goals with our intuitive task management system.
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, #4F6EF7 0%, #7C3AED 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(79, 110, 247, 0.35)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(79, 110, 247, 0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 110, 247, 0.35)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go to My Tasks
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl transition-all cursor-pointer"
              style={{ 
                background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)',
                cursor: 'pointer'
              }}
              onClick={() => navigate(feature.route)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                style={{ 
                  background: `${feature.color}15`,
                  color: feature.color
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: isDark ? '#8E8E93' : '#6E6E73' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div 
          className="p-8 rounded-2xl text-center"
          style={{ 
            background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: isDark ? '#F5F5F7' : '#1D1D1F' }}>
            立即开始管理你的任务
          </h2>
          <p className="text-sm mb-6 max-w-xl mx-auto" style={{ color: isDark ? '#8E8E93' : '#6E6E73' }}>
            选择上方任意功能卡片开始使用，或点击下方按钮直接前往任务列表，创建你的第一个任务。
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all"
            style={{
              background: isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(243, 244, 246, 0.8)',
              color: isDark ? '#F5F5F7' : '#1D1D1F',
              border: isDark ? '1px solid rgba(50, 50, 50, 0.6)' : '1px solid rgba(229, 229, 234, 0.6)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isDark ? 'rgba(50, 50, 50, 0.9)' : 'rgba(229, 231, 235, 0.9)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(243, 244, 246, 0.8)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Create Your First Task
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ color: isDark ? '#6E6E73' : '#8E8E93' }}>
        <p className="text-sm">
          © 2026 Task Manager. Built with React & Node.js
        </p>
      </footer>
    </div>
  );
}
