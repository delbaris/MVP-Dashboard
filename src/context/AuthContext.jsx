import React, { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "mvp-dashboard-auth";
const DEMO_USER = { name: "مدیر سامانه", email: "admin@robinparham.local", role: "مدیر ارشد" };

function getStoredUser() {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);

    const login = useCallback((email, password) => {
        if (email.trim().toLowerCase() !== DEMO_USER.email || password !== "123456") {
            return { success: false, message: "ایمیل یا رمز عبور صحیح نیست." };
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
        setUser(DEMO_USER);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
