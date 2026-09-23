import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alerts } from "../data/alerts.js";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { severityMap } from "../utils/statusMaps.js";

const typeToRoute = {
    project: (id) => `/projects/${id}`,
    employee: (id) => `/employees/${id}`,
    task: () => `/projects`,
    team: () => `/employees`,
    candidate: (id) => `/recruitment/${id}`,
};

const typeLabel = {
    project: "پروژه",
    employee: "کارمند",
    task: "Task",
    team: "تیم",
    candidate: "داوطلب",
};

export default function Alerts() {
    const navigate = useNavigate();
    const [severity, setSeverity] = useState("all");

    const filtered = severity === "all" ? alerts : alerts.filter((a) => a.severity === severity);
    const sorted = [...filtered].sort((a, b) => (a.severity === "بالا" ? -1 : b.severity === "بالا" ? 1 : 0));

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>هشدارها و ریسک‌ها</h1>
                    <p className="page-subtitle">مواردی که نیاز به توجه فوری یا برنامه‌ریزی مدیریتی دارند</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="filters-bar">
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="all">همه سطوح</option>
                    <option value="بالا">بالا</option>
                    <option value="متوسط">متوسط</option>
                    <option value="کم">کم</option>
                </select>
                <span className="result-count">{sorted.length} هشدار از {alerts.length}</span>
            </div>

            <div className="card card-pad">
                {sorted.length === 0 ? (
                    <EmptyState icon="✅" title="هشداری با این فیلتر یافت نشد" />
                ) : (
                    <div className="vstack" style={{ gap: 10 }}>
                        {sorted.map((alert) => {
                            const sev = severityMap[alert.severity];
                            const routeFn = typeToRoute[alert.type];
                            return (
                                <div key={alert.id} className="alert-row" onClick={() => routeFn && navigate(routeFn(alert.relatedId))}>
                                    <span className="alert-icon">⚠</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{alert.title}</div>
                                        <div className="muted" style={{ fontSize: 12.5, margin: "4px 0" }}>{alert.description}</div>
                                        <div className="faint" style={{ fontSize: 11 }}>
                                            نوع: {typeLabel[alert.type]} · تاریخ: {alert.date}
                                        </div>
                                    </div>
                                    <Badge className={sev.badge}>{alert.severity}</Badge>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
