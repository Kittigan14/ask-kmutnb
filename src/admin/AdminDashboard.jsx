import React from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import AdminProfile from "./pages/AdminProfile";
import Statistics from "./pages/Statistics";
import EditData from "./pages/EditData";
import "./admin.css";

const NAV_ITEMS = [
    { to: "/admin/profile", icon: "fa-user-shield", label: "Admin Profile" },
    { to: "/admin/statistics", icon: "fa-chart-bar", label: "Statistics" },
    { to: "/admin/edit", icon: "fa-database", label: "Edit Data" },
];

const PAGE_META = {
    "/admin/profile": { title: "Admin Profile", sub: "ข้อมูลผู้ดูแลระบบ" },
    "/admin/statistics": { title: "Statistics", sub: "สถิติการใช้งานระบบ" },
    "/admin/edit": { title: "Edit Data", sub: "จัดการข้อมูลคำถามแนะนำ" },
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const meta = PAGE_META[location.pathname] || { title: "Admin", sub: "ASK KMUTNB" };

    const loginTime = sessionStorage.getItem("admin_login_time");
    const loginStr = loginTime
        ? new Date(loginTime).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })
        : "-";

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth");
        sessionStorage.removeItem("admin_login_time");
        navigate("/login/admin");
    };

    // If exact /admin → redirect to /admin/profile
    React.useEffect(() => {
        if (location.pathname === "/admin") navigate("/admin/profile", { replace: true });
    }, [location.pathname, navigate]);

    return (
        <div className="admin-root">
            {/* ── SIDEBAR ── */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand">
                    <div className="brand-icon">
                        <i className="fas fa-shield-halved" />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">Admin Panel</span>
                        <span className="brand-sub">ASK KMUTNB</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    <span className="admin-nav-section-label">เมนูหลัก</span>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `admin-nav-item${isActive ? " active" : ""}`
                            }
                        >
                            <span className="nav-icon">
                                <i className={`fas ${item.icon}`} />
                            </span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <span className="nav-icon">
                            <i className="fas fa-right-from-bracket" />
                        </span>
                        <span className="nav-label">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-title">
                        <h2>{meta.title}</h2>
                        <span>{meta.sub}</span>
                    </div>
                    <div className="admin-topbar-right">
                        <span className="admin-topbar-time">
                            <i className="fas fa-clock" style={{ marginRight: 6, color: "var(--admin-accent)" }} />
                            Login: {loginStr}
                        </span>
                        <div className="admin-topbar-avatar" title="adminkmutnB">A</div>
                    </div>
                </header>

                <main className="admin-content">
                    <Routes>
                        <Route path="profile" element={<AdminProfile />} />
                        <Route path="statistics" element={<Statistics />} />
                        <Route path="edit" element={<EditData />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
