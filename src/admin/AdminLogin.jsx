import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const ADMIN_USER = "adminkmutnB";
const ADMIN_PASS = "Rtzwqras1256";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simulate a small delay for UX
        setTimeout(() => {
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                sessionStorage.setItem("admin_auth", "true");
                sessionStorage.setItem("admin_login_time", new Date().toISOString());
                navigate("/admin");
            } else {
                setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                setLoading(false);
            }
        }, 600);
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <div className="logo-icon">
                        <i className="fas fa-shield-halved" />
                    </div>
                    <h1>Admin Panel</h1>
                    <p>ASK KMUTNB — ระบบผู้ดูแล</p>
                </div>

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="admin-field">
                        <label>ชื่อผู้ใช้</label>
                        <div className="admin-input-wrap">
                            <input
                                type="text"
                                placeholder="กรอกชื่อผู้ใช้"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <i className="fas fa-user" />
                        </div>
                    </div>

                    <div className="admin-field">
                        <label>รหัสผ่าน</label>
                        <div className="admin-input-wrap">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="กรอกรหัสผ่าน"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <i
                                className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}
                                style={{ right: 14, left: "auto", cursor: "pointer", pointerEvents: "all" }}
                                onClick={() => setShowPass(!showPass)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="admin-error">
                            <i className="fas fa-circle-exclamation" />
                            {error}
                        </div>
                    )}

                    <button className="admin-login-btn" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" />
                                กำลังตรวจสอบ...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-right-to-bracket" />
                                เข้าสู่ระบบ Admin
                            </>
                        )}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <i className="fas fa-lock" style={{ marginRight: 6 }} />
                    เข้าถึงได้เฉพาะผู้ดูแลระบบเท่านั้น
                </div>
            </div>
        </div>
    );
}
