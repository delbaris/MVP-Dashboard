import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import Icon from "./Icon.jsx";

export default function ToastContainer() {
    const { toasts } = useApp();
    if (!toasts.length) return null;
    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.tone}`} role="status">
                    <Icon name={t.tone === "error" ? "alert" : "check"} size={16} />
                    <span>{t.message}</span>
                </div>
            ))}
        </div>
    );
}
