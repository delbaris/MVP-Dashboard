import React from "react";

export default function Drawer({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
                <div
                    style={{
                        padding: "18px 22px",
                        borderBottom: "1px solid var(--color-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        background: "#fff",
                        zIndex: 2,
                    }}
                >
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-navy-900)" }}>{title}</h3>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ بستن</button>
                </div>
                <div style={{ padding: 22 }}>{children}</div>
            </div>
        </div>
    );
}
