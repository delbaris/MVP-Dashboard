import React from "react";

export default function ProgressBar({ value = 0, color }) {
    const clamped = Math.max(0, Math.min(100, value));
    let barColor = color;
    if (!barColor) {
        if (clamped >= 80) barColor = "#1f8a5f";
        else if (clamped >= 50) barColor = "#3a6ea5";
        else if (clamped >= 25) barColor = "#b8860b";
        else barColor = "#b23b3b";
    }
    return (
        <div className="progress-track">
            <div className="progress-fill" style={{ width: `${clamped}%`, background: barColor }} />
        </div>
    );
}
