import React, { createContext, useCallback, useContext, useState } from "react";
import { roles } from "../data/journey.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [role, setRole] = useState("executive");
    const [presentationMode, setPresentationMode] = useState(false);
    const [toasts, setToasts] = useState([]);

    const pushToast = useCallback((message, tone = "default") => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, message, tone }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3200);
    }, []);

    const currentRole = roles.find((r) => r.key === role) || roles[0];

    return (
        <AppContext.Provider
            value={{
                role,
                setRole,
                currentRole,
                presentationMode,
                setPresentationMode,
                pushToast,
                toasts,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
