import React, { useState } from "react";

const INITIAL_CATEGORIES = [
    {
        id: "tcas", icon: "fa-graduation-cap", label: "TCAS",
        questions: [
            "TCAS รอบ 1–4 ต่างกันอย่างไร",
            "กำหนดการและรายละเอียด TCAS รอบ 1",
            "กำหนดการและรายละเอียด TCAS รอบ 2",
            "กำหนดการและรายละเอียด TCAS รอบ 3",
            "กำหนดการและรายละเอียด TCAS รอบ 4",
            "ถ้าเกรดเฉลี่ยประมาณ 2.80–3.00 ควรเลือกสมัครรอบไหนดี",
            "แต่ละรอบใช้คะแนนอะไรบ้าง (TGAT/TPAT/A-Level)",
            "จบ ปวส. สามารถสมัครสาขาไหนได้บ้าง",
            "จบ ปวช. สามารถสมัครสาขาไหนได้บ้าง",
            "จบ ม.6 สายวิทย์-คณิตศาสตร์เข้าสาขาไหนได้บ้าง",
            "จบ ม.6 สายศิลป์เข้าสาขาไหนได้บ้าง",
            "ระเบียบการสมัคร",
        ],
    },
    { id: "it", icon: "fa-laptop-code", label: "สาขา IT", questions: ["สาขา IT เรียนเกี่ยวกับอะไรบ้าง", "จบ IT ทำงานอะไรได้บ้าง", "IT เรียนเกี่ยวกับอะไร", "หน่วยกิตรวม IT"] },
    { id: "ine", icon: "fa-wifi", label: "สาขา INE", questions: ["สาขา INE เรียนเกี่ยวกับอะไรบ้าง", "จบ INE ทำงานอะไรได้บ้าง", "INE เรียนเกี่ยวกับอะไร", "หน่วยกิตรวม INE"] },
    { id: "inet", icon: "fa-network-wired", label: "สาขา INET", questions: ["สาขา INET เรียนเกี่ยวกับอะไรบ้าง", "จบ INET ทำงานอะไรได้บ้าง", "INET เรียนเกี่ยวกับอะไร", "หน่วยกิตรวม INET"] },
    { id: "iti", icon: "fa-server", label: "สาขา ITI", questions: ["สาขา ITI เรียนเกี่ยวกับอะไรบ้าง", "จบ ITI ทำงานอะไรได้บ้าง", "ITI เรียนเกี่ยวกับอะไร", "หน่วยกิตรวม ITI"] },
    { id: "itt", icon: "fa-microchip", label: "สาขา ITT", questions: ["สาขา ITT เรียนเกี่ยวกับอะไรบ้าง", "จบ ITT ทำงานอะไรได้บ้าง", "ITT เรียนเกี่ยวกับอะไร", "หน่วยกิตรวม ITT"] },
];

function Toast({ message, onHide }) {
    React.useEffect(() => {
        const t = setTimeout(onHide, 2800);
        return () => clearTimeout(t);
    }, [onHide]);
    return (
        <div className="admin-toast">
            <i className="fas fa-check-circle" />
            {message}
        </div>
    );
}

export default function EditData() {
    const [cats, setCats] = useState(INITIAL_CATEGORIES);
    const [openId, setOpenId] = useState(null);
    const [search, setSearch] = useState("");
    const [newQ, setNewQ] = useState({});          // { catId: string }
    const [modal, setModal] = useState(null);       // { catId, qIdx, text }
    const [toast, setToast] = useState(null);

    const showToast = (msg) => setToast(msg);
    const hideToast = () => setToast(null);

    // Helpers
    const updateCat = (catId, fn) =>
        setCats((prev) => prev.map((c) => (c.id === catId ? fn(c) : c)));

    const handleDeleteQ = (catId, qIdx) => {
        updateCat(catId, (c) => ({ ...c, questions: c.questions.filter((_, i) => i !== qIdx) }));
        showToast("ลบคำถามแล้ว");
    };

    const handleAddQ = (catId) => {
        const text = (newQ[catId] || "").trim();
        if (!text) return;
        updateCat(catId, (c) => ({ ...c, questions: [...c.questions, text] }));
        setNewQ((p) => ({ ...p, [catId]: "" }));
        showToast("เพิ่มคำถามแล้ว");
    };

    const handleOpenEdit = (catId, qIdx, text) =>
        setModal({ catId, qIdx, text });

    const handleSaveEdit = () => {
        const { catId, qIdx, text } = modal;
        updateCat(catId, (c) => {
            const qs = [...c.questions];
            qs[qIdx] = text;
            return { ...c, questions: qs };
        });
        setModal(null);
        showToast("แก้ไขคำถามแล้ว");
    };

    // Filter categories & questions by search
    const filtered = cats
        .map((cat) => ({
            ...cat,
            questions: cat.questions.filter(
                (q) =>
                    search === "" ||
                    q.toLowerCase().includes(search.toLowerCase()) ||
                    cat.label.toLowerCase().includes(search.toLowerCase())
            ),
        }))
        .filter((cat) => search === "" || cat.questions.length > 0 || cat.label.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="admin-page-header">
                <h2>Edit Data</h2>
                <p>จัดการข้อมูลคำถามแนะนำในระบบ ASK KMUTNB</p>
            </div>

            {/* Toolbar */}
            <div className="edit-data-toolbar">
                <div className="admin-search-input">
                    <i className="fas fa-search" />
                    <input
                        type="text"
                        placeholder="ค้นหาคำถามหรือหมวดหมู่..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--admin-text-muted)" }}>
                        {cats.reduce((a, c) => a + c.questions.length, 0)} คำถาม / {cats.length} หมวด
                    </span>
                </div>
            </div>

            {/* Category accordion cards */}
            <div className="edit-cats-grid">
                {filtered.map((cat, ci) => {
                    const isOpen = openId === cat.id;
                    return (
                        <div
                            key={cat.id}
                            className={`edit-cat-card${isOpen ? " expanded" : ""}`}
                            style={{ animationDelay: `${ci * 0.05}s` }}
                        >
                            {/* Header */}
                            <div className="edit-cat-header" onClick={() => setOpenId(isOpen ? null : cat.id)}>
                                <div className="edit-cat-header-left">
                                    <div className="edit-cat-icon">
                                        <i className={`fas ${cat.icon}`} />
                                    </div>
                                    <div>
                                        <div className="edit-cat-title">{cat.label}</div>
                                        <div className="edit-cat-count">{cat.questions.length} คำถาม</div>
                                    </div>
                                </div>
                                <div className="edit-cat-actions" onClick={(e) => e.stopPropagation()}>
                                    <i className="fas fa-chevron-down edit-cat-chevron" />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="edit-cat-body">
                                <div className="edit-questions-list">
                                    {cat.questions.map((q, qi) => (
                                        <div className="edit-question-item" key={qi}>
                                            <span className="edit-question-num">{qi + 1}</span>
                                            <span className="edit-question-text">{q}</span>
                                            <div className="edit-question-btns">
                                                <button
                                                    className="edit-icon-btn edit"
                                                    title="แก้ไข"
                                                    onClick={() => handleOpenEdit(cat.id, qi, q)}
                                                >
                                                    <i className="fas fa-pen" />
                                                </button>
                                                <button
                                                    className="edit-icon-btn delete"
                                                    title="ลบ"
                                                    onClick={() => handleDeleteQ(cat.id, qi)}
                                                >
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add new question row */}
                                    <div className="edit-add-question">
                                        <input
                                            type="text"
                                            placeholder="เพิ่มคำถามใหม่..."
                                            value={newQ[cat.id] || ""}
                                            onChange={(e) =>
                                                setNewQ((p) => ({ ...p, [cat.id]: e.target.value }))
                                            }
                                            onKeyDown={(e) => e.key === "Enter" && handleAddQ(cat.id)}
                                        />
                                        <button
                                            className="admin-btn admin-btn-primary admin-btn-sm"
                                            onClick={() => handleAddQ(cat.id)}
                                        >
                                            <i className="fas fa-plus" />
                                            เพิ่ม
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit modal */}
            {modal && (
                <div className="admin-modal-backdrop" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>
                            <i className="fas fa-pen-to-square" />
                            แก้ไขคำถาม
                        </h3>
                        <textarea
                            rows={3}
                            value={modal.text}
                            onChange={(e) => setModal((m) => ({ ...m, text: e.target.value }))}
                            autoFocus
                        />
                        <div className="admin-modal-actions">
                            <button
                                className="admin-btn admin-btn-ghost"
                                onClick={() => setModal(null)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={handleSaveEdit}
                            >
                                <i className="fas fa-check" />
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <Toast message={toast} onHide={hideToast} />}
        </div>
    );
}
