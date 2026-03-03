import React from "react";

const loginTime = sessionStorage.getItem("admin_login_time");

export default function AdminProfile() {
    const loginStr = loginTime
        ? new Date(loginTime).toLocaleString("th-TH", {
            dateStyle: "long",
            timeStyle: "medium",
        })
        : "ไม่ทราบ";

    return (
        <div>
            <div className="admin-page-header">
                <h2>Admin Profile</h2>
                <p>ข้อมูลบัญชีผู้ดูแลระบบ ASK KMUTNB</p>
            </div>

            {/* Main profile card */}
            <div className="profile-card">
                <div className="profile-avatar">A</div>
                <div className="profile-info">
                    <h3>adminkmutnB</h3>
                    <div className="profile-role-badge">
                        <i className="fas fa-crown" />
                        Super Administrator
                    </div>
                    <div className="profile-details">
                        <div className="profile-detail-item">
                            <span className="detail-label">Username</span>
                            <span className="detail-value">adminkmutnB</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">Role</span>
                            <span className="detail-value">Super Admin</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">ระบบ</span>
                            <span className="detail-value">ASK KMUTNB</span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="detail-label">สถานะ</span>
                            <span className="detail-value" style={{ color: "#70dc96" }}>
                                <i className="fas fa-circle" style={{ fontSize: "0.55rem", marginRight: 6 }} />
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info cards */}
            <div className="admin-info-cards">
                <div className="admin-info-card">
                    <div className="info-icon">
                        <i className="fas fa-clock" />
                    </div>
                    <div className="info-text">
                        <strong>เข้าสู่ระบบเมื่อ</strong>
                        <span>{loginStr}</span>
                    </div>
                </div>
                <div className="admin-info-card">
                    <div className="info-icon">
                        <i className="fas fa-key" />
                    </div>
                    <div className="info-text">
                        <strong>ประเภทการยืนยัน</strong>
                        <span>Session Token</span>
                    </div>
                </div>
                <div className="admin-info-card">
                    <div className="info-icon">
                        <i className="fas fa-globe" />
                    </div>
                    <div className="info-text">
                        <strong>ระบบ</strong>
                        <span>ASK KMUTNB Chatbot</span>
                    </div>
                </div>
                <div className="admin-info-card">
                    <div className="info-icon">
                        <i className="fas fa-university" />
                    </div>
                    <div className="info-text">
                        <strong>มหาวิทยาลัย</strong>
                        <span>มจพ. (KMUTNB)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
