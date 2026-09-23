import React from "react";

export default function Modal({ open, onClose, title, children, width = 560 }) {
    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="card"
                style={{ width: "100%", maxWidth: width, maxHeight: "85vh", overflowY: "auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-navy-900)" }}>{title}</h3>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ بستن</button>
                </div>
                <div style={{ padding: 22 }}>{children}</div>
            </div>
        </div>
    );
}
