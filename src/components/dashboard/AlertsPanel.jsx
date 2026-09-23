import React from "react";
import { useNavigate } from "react-router-dom";
import { alerts } from "../../data/alerts.js";
import Badge from "../ui/Badge.jsx";
import { severityMap } from "../../utils/statusMaps.js";

const typeToRoute = {
    project: (id) => `/projects/${id}`,
    employee: (id) => `/employees/${id}`,
    task: () => `/projects`,
    team: () => `/employees`,
    candidate: (id) => `/recruitment/${id}`,
};

export default function AlertsPanel({ limit = 5 }) {
    const navigate = useNavigate();
    const top = [...alerts].sort((a, b) => (a.severity === "بالا" ? -1 : 1)).slice(0, limit);

    return (
        <div className="card card-pad">
            <div className="card-title-row">
                <h3>هشدارهای مهم</h3>
                <span className="link-more" onClick={() => navigate("/alerts")}>مشاهده همه ←</span>
            </div>
            <div className="vstack" style={{ gap: 10 }}>
                {top.map((alert) => {
                    const sev = severityMap[alert.severity];
                    const routeFn = typeToRoute[alert.type];
                    return (
                        <div
                            key={alert.id}
                            className="alert-row"
                            onClick={() => routeFn && navigate(routeFn(alert.relatedId))}
                        >
                            <span className="alert-icon">⚠</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{alert.title}</div>
                                <div className="faint" style={{ fontSize: 12 }}>{alert.description}</div>
                            </div>
                            <Badge className={sev.badge}>{alert.severity}</Badge>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
