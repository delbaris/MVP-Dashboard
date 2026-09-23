import React from "react";

export default function KpiCard({ icon, label, value, trend, trendTone = "flat", note, onClick }) {
    const trendClass =
        trendTone === "up" ? "kpi-trend-up" : trendTone === "down" ? "kpi-trend-down" : "kpi-trend-flat";
    return (
        <button className="card card-pad kpi-card" onClick={onClick} type="button">
            <div className="kpi-card-top">
                <span className="kpi-icon">{icon}</span>
                {trend && <span className={trendClass}>{trend}</span>}
            </div>
            <div className="kpi-value">{typeof value === "number" ? value.toLocaleString("fa-IR") : value}</div>
            <div className="kpi-label">{label}</div>
            {note && <div className="kpi-note faint">{note}</div>}
        </button>
    );
}
