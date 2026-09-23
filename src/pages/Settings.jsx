import React from "react";
import { useApp } from "../context/AppContext.jsx";
import { roles, auditTrail } from "../data/journey.js";

const INTEGRATIONS = [
    { name: "GitHub", status: "مفهومی" },
    { name: "Jira", status: "مفهومی" },
    { name: "Trello", status: "مفهومی" },
    { name: "Slack", status: "مفهومی" },
    { name: "Microsoft Teams", status: "مفهومی" },
    { name: "Email", status: "مفهومی" },
    { name: "Calendar", status: "مفهومی" },
];

export default function Settings() {
    const { role, setRole, presentationMode, setPresentationMode, pushToast } = useApp();

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>تنظیمات</h1>
                    <p className="page-subtitle">مدیریت نقش‌ها، حالت ارائه و یکپارچه‌سازی‌های مفهومی آینده</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="vstack" style={{ gap: 20 }}>
                <div className="card card-pad">
                    <div className="section-title">مدل دسترسی نقش‌ها (Role Based Access - مفهومی)</div>
                    <div className="role-card-grid">
                        {roles.map((r) => (
                            <div
                                key={r.key}
                                className={`role-card ${role === r.key ? "role-active" : ""}`}
                                onClick={() => {
                                    setRole(r.key);
                                    pushToast(`نقش کاربری به «${r.labelFa}» تغییر کرد`);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.labelFa}</div>
                                <div className="faint" style={{ fontSize: 11.5, marginBottom: 8 }}>{r.label}</div>
                                <div className="muted" style={{ fontSize: 12.5 }}>{r.access}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card card-pad">
                    <div className="section-title">حالت ارائه (Presentation Mode)</div>
                    <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
                        در این حالت، بدون به‌هم‌زدن چیدمان ریسپانسیو، صفحه برای ارائه حضوری به مدیرعامل بزرگ‌تر و تمیزتر نمایش داده می‌شود.
                    </p>
                    <button
                        className={`btn ${presentationMode ? "btn-primary" : ""}`}
                        onClick={() => setPresentationMode((v) => !v)}
                    >
                        {presentationMode ? "خروج از حالت ارائه" : "فعال‌سازی حالت ارائه"}
                    </button>
                </div>

                <div className="card card-pad">
                    <div className="section-title">یکپارچه‌سازی‌های آینده (Mock)</div>
                    <div className="hstack" style={{ flexWrap: "wrap", gap: 10 }}>
                        {INTEGRATIONS.map((i) => (
                            <span key={i.name} className="tag" style={{ fontSize: 12.5, padding: "8px 14px" }}>
                                {i.name} · {i.status}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="card card-pad">
                    <div className="section-title">Audit Trail (شفافیت تغییرات مهم)</div>
                    <div className="vstack" style={{ gap: 0 }}>
                        {auditTrail.map((entry, i) => (
                            <div key={i} className="audit-row">
                                <span className="audit-time">{entry.date} · {entry.time}</span>
                                <span>
                                    <strong>{entry.actor}</strong> — {entry.description}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
