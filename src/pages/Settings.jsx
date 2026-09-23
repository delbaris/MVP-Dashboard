import React, { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { roles, auditTrail } from "../data/journey.js";
import { useData } from "../context/DataContext.jsx";

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
    const { resetDemoData } = useData();
    const [provider, setProvider] = useState("OpenAI-compatible");
    const [baseUrl, setBaseUrl] = useState("http://localhost:11434/v1");
    const [model, setModel] = useState("local-model");
    const [saved, setSaved] = useState(false);

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
                    <div className="section-title">اتصال دستیار هوشمند (تنظیمات دمو)</div>
                    <p className="muted integration-description">اطلاعات اتصال فقط برای آماده‌سازی UI است و در این نسخه به هیچ سرویس بیرونی ارسال نمی‌شود.</p>
                    <div className="integration-form-grid">
                        <label className="form-field"><span>ارائه‌دهنده</span><select value={provider} onChange={(e) => setProvider(e.target.value)}><option>OpenAI-compatible</option><option>سرویس داخلی سازمان</option><option>Ollama محلی</option></select></label>
                        <label className="form-field"><span>نام مدل</span><input value={model} onChange={(e) => setModel(e.target.value)} /></label>
                        <label className="form-field integration-url"><span>آدرس API</span><input dir="ltr" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} /></label>
                        <label className="form-field integration-url"><span>کلید API (اختیاری در دمو)</span><input dir="ltr" type="password" placeholder="در این نسخه ذخیره نمی‌شود" /></label>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setSaved(true); pushToast("تنظیمات اتصال دستیار در وضعیت دمو ثبت شد"); }} type="button">{saved ? "تنظیمات ثبت شد" : "ثبت تنظیمات اتصال"}</button>
                </div>

                <div className="card card-pad">
                    <div className="section-title">یکپارچه‌سازی‌های آینده</div>
                    <div className="hstack" style={{ flexWrap: "wrap", gap: 10 }}>
                        {INTEGRATIONS.map((i) => (
                            <span key={i.name} className="tag" style={{ fontSize: 12.5, padding: "8px 14px" }}>
                                {i.name} · {i.status}
                            </span>
                        ))}
                    </div>

                    <div className="card card-pad">
                        <div className="section-title">داده‌های نمایشی</div>
                        <p className="muted integration-description">اطلاعات ثبت‌شده در این دموی مرورگر در localStorage نگهداری می‌شود و فقط برای تست جریان ورود اطلاعات است.</p>
                        <button className="btn btn-secondary" type="button" onClick={() => { resetDemoData(); pushToast("داده‌های دمو به وضعیت اولیه بازگردانی شد"); }}>
                            بازنشانی داده‌های دمو
                        </button>
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
