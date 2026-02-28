import React, { useState } from "react";

const CATEGORIES = [
    {
        id: "tcas",
        icon: "fa-graduation-cap",
        label: "TCAS",
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
    {
        id: "it",
        icon: "fa-laptop-code",
        label: "สาขา IT",
        questions: [
            "สาขา IT เรียนเกี่ยวกับอะไรบ้าง",
            "จบ IT ทำงานอะไรได้บ้าง",
            "IT เรียนเกี่ยวกับอะไร",
            "หน่วยกิตรวม IT",
        ],
    },
    {
        id: "ine",
        icon: "fa-wifi",
        label: "สาขา INE",
        questions: [
            "สาขา INE เรียนเกี่ยวกับอะไรบ้าง",
            "จบ INE ทำงานอะไรได้บ้าง",
            "INE เรียนเกี่ยวกับอะไร",
            "หน่วยกิตรวม INE",
        ],
    },
    {
        id: "inet",
        icon: "fa-network-wired",
        label: "สาขา INET",
        questions: [
            "สาขา INET เรียนเกี่ยวกับอะไรบ้าง",
            "จบ INET ทำงานอะไรได้บ้าง",
            "INET เรียนเกี่ยวกับอะไร",
            "หน่วยกิตรวม INET",
        ],
    },
    {
        id: "iti",
        icon: "fa-server",
        label: "สาขา ITI",
        questions: [
            "สาขา ITI เรียนเกี่ยวกับอะไรบ้าง",
            "จบ ITI ทำงานอะไรได้บ้าง",
            "ITI เรียนเกี่ยวกับอะไร",
            "หน่วยกิตรวม ITI",
        ],
    },
    {
        id: "itt",
        icon: "fa-microchip",
        label: "สาขา ITT",
        questions: [
            "สาขา ITT เรียนเกี่ยวกับอะไรบ้าง",
            "จบ ITT ทำงานอะไรได้บ้าง",
            "ITT เรียนเกี่ยวกับอะไร",
            "หน่วยกิตรวม ITT",
        ],
    },
];

export default function SuggestedQuestions({ onSelectQuestion }) {
    const [openId, setOpenId] = useState(null);

    const toggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="suggested-questions">
            {CATEGORIES.map((cat) => {
                const isOpen = openId === cat.id;
                return (
                    <div key={cat.id} className={`sq-category ${isOpen ? "open" : ""}`}>
                        <button
                            className="sq-header"
                            onClick={() => toggle(cat.id)}
                            aria-expanded={isOpen}
                        >
                            <span className="sq-header-left">
                                <i className={`fas ${cat.icon}`}></i>
                                <span className="sq-label">{cat.label}</span>
                            </span>
                            <i className={`fas fa-chevron-down sq-chevron`}></i>
                        </button>

                        <div className="sq-body" style={{ "--count": cat.questions.length }}>
                            <ul className="sq-list">
                                {cat.questions.map((q, i) => (
                                    <li key={i}>
                                        <button
                                            className="sq-question"
                                            onClick={() => onSelectQuestion(q)}
                                        >
                                            <span className="sq-num">{i + 1}</span>
                                            <span>{q}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
