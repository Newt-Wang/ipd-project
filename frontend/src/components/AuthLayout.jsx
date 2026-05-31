export default function AuthLayout({ children, variant = "login" }) {
  const isRegister = variant === "register";
  const previewItems = isRegister
    ? [
        { title: "Account setup", meta: "Ready", tone: "blue" },
        { title: "Course tasks", meta: "Draft", tone: "teal" },
        { title: "Sprint notes", meta: "Next", tone: "orange" }
      ]
    : [
        { title: "Design review", meta: "09:30", tone: "teal" },
        { title: "Frontend polish", meta: "11:00", tone: "blue" },
        { title: "API checks", meta: "14:15", tone: "orange" }
      ];

  return (
    <main className={`auth-bg auth-bg-${variant}`}>
      <section className="auth-layout">
        <aside className="auth-showcase" aria-hidden="true">
          <div className="auth-brand-lockup">
            <div className="auth-logo">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M8 7h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M8 12h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M8 17h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>Task Manager</span>
          </div>

          <div className="auth-showcase-copy">
            <p className="auth-showcase-kicker">
              {isRegister ? "New workspace" : "Daily workspace"}
            </p>
            <h2 className="auth-showcase-title">Task Manager</h2>
          </div>

          <div className="auth-preview">
            <div className="auth-preview-header">
              <div>
                <span>Today</span>
                <strong>{isRegister ? "Setup" : "Focus"}</strong>
              </div>
              <div className="auth-preview-pill">{isRegister ? "03" : "04"}</div>
            </div>

            <div className="auth-preview-list">
              {previewItems.map((item) => (
                <div className="auth-preview-item" key={item.title}>
                  <span className={`auth-preview-dot ${item.tone}`} />
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="auth-preview-progress">
              <div>
                <span>Progress</span>
                <strong>{isRegister ? "42%" : "78%"}</strong>
              </div>
              <div className="auth-progress-track">
                <span style={{ width: isRegister ? "42%" : "78%" }} />
              </div>
            </div>
          </div>
        </aside>

        {children}
      </section>
    </main>
  );
}
