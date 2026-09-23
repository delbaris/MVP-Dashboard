import React from "react";
import { useApp } from "../../context/AppContext.jsx";

export default function ToastContainer() {
    const { toasts } = useApp();
    if (!toasts.length) return null;
    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className="toast">
                    {t.message}
                </div>
            ))}
        </div>
    );
}
