import React from "react";

export default function EmptyState({ icon = "🗂️", title = "داده‌ای برای نمایش وجود ندارد", subtitle }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <div style={{ fontWeight: 600, color: "var(--color-text)" }}>{title}</div>
            {subtitle ? <div style={{ marginTop: 6, fontSize: 12 }}>{subtitle}</div> : null}
        </div>
    );
}
