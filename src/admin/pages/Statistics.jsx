import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";

export default function Statistics() {

    const [stats, setStats] = useState({
        totalSessions: 0,
        totalMessages: 0,
        weekData: [],
        categories: []
    });

    useEffect(() => {
    fetchStats();
}, []);
    async function fetchStats() {

        // ดึงข้อมูลทั้งหมด
        const { data, error } = await supabase
            .from("Userdatabase")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        // ===== 1. นับจำนวนข้อความทั้งหมด =====
        const totalMessages = data.length;

        // ===== 2. นับ session จาก metadata.userid =====
        const uniqueUsers = new Set();

        data.forEach(row => {
            if (row.metadata?.userid) {
                uniqueUsers.add(row.metadata.userid);
            }
        });

        const totalSessions = uniqueUsers.size;

        // ===== 3. 7 วันล่าสุด (เวลาไทย) =====
        const weekMap = {};

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        data.forEach(row => {
            const dateUTC = new Date(row.created_at);

            // แปลงเป็นเวลาไทย
            const thaiDate = new Date(
                dateUTC.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
            );

            if (thaiDate >= sevenDaysAgo) {
                const day = thaiDate.toLocaleDateString("th-TH", {
                    weekday: "short"
                });

                weekMap[day] = (weekMap[day] || 0) + 1;
            }
        });

        const weekData = Object.keys(weekMap).map(day => ({
            day,
            value: weekMap[day]
        }));

        // ===== 4. วิเคราะห์หมวดหมู่จากข้อความ =====
        const categoryMap = {
            TCAS: 0,
            IT: 0,
            INE: 0,
            INET: 0,
            ITI: 0,
            ITT: 0,
            campus: 0,
            curriculum: 0,
            other: 0
        };

data.forEach(row => {
    const msg = row.message?.toLowerCase() || "";

    if (/(tcas\s*\d*|portfolio|ระเบียบการสมัคร|ปวช|ปวส|ศิลป์|สามัญ|วิทย์|คณิต)/i.test(msg)) {
        categoryMap.TCAS++;

    } else if (/inet/i.test(msg)) {
        categoryMap.INET++;

    } else if (/ine/i.test(msg)) {
        categoryMap.INE++;

    } else if (/iti/i.test(msg)) {
        categoryMap.ITI++;

    } else if (/itt/i.test(msg)) {
        categoryMap.ITT++;

    } else if (/\bit\b/i.test(msg)) {   
        categoryMap.IT++;

    } else if (/(วิทยาเขต|ห้อง|สถานที่)/i.test(msg)) {
        categoryMap.campus++;

    } else if (/(วิชา|หลักสูตร|ต่อยอด|แผนการเรียน)/i.test(msg)) {
        categoryMap.curriculum++;

    } else {
        categoryMap.other++;
    }
});

        const categories = Object.keys(categoryMap).map(key => ({
            label: key,
            questions: categoryMap[key]
        }));

        setStats({
            totalSessions,
            totalMessages,
            weekData,
            categories
        });
    }

    const maxVal = Math.max(...stats.weekData.map(d => d.value), 1);
    const totalQ = stats.categories.reduce((a, c) => a + c.questions, 0);

    return (
        <div>
            <div className="admin-page-header">
                <h2>Statistics</h2>
                <p>สถิติและภาพรวมการใช้งาน ASK KMUTNB Chatbot</p>
            </div>

            {/* Stat Cards */}
            <div className="stat-cards">
                <div className="stat-card">
                    <div className="stat-card-value">{stats.totalSessions}</div>
                    <div className="stat-card-label">จำนวน Session</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-value">{stats.totalMessages}</div>
                    <div className="stat-card-label">ข้อความทั้งหมด</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-value">{stats.categories.length}</div>
                    <div className="stat-card-label">หมวดหมู่</div>
                </div>
            </div>

            {/* 7 Day Chart */}
            <div className="admin-chart-section">
                <h3>การใช้งาน 7 วันล่าสุด</h3>
                <div className="admin-bar-chart">
                    {stats.weekData.map((d) => (
                        <div className="admin-bar-wrap" key={d.day}>
                            <div
                                className="admin-bar"
                                style={{ height: `${(d.value / maxVal) * 100}%` }}
                            />
                            <span>{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Table */}
            <div className="admin-table-section">
                <h3>รายละเอียดหมวดหมู่คำถาม</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>หมวดหมู่</th>
                            <th>จำนวน</th>
                            <th>สัดส่วน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.categories.map((cat, i) => {
                            const pct = totalQ
                                ? Math.round((cat.questions / totalQ) * 100)
                                : 0;

                            return (
                                <tr key={i}>
                                    <td>{cat.label}</td>
                                    <td>{cat.questions}</td>
                                    <td>{pct}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}