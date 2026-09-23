import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../ui/Icon.jsx";

const NAV_ITEMS = [
    { to: "/", label: "داشبورد", icon: "compass", end: true },
    { to: "/employees", label: "پرسنل", icon: "users" },
    { to: "/recruitment", label: "جذب و استخدام", icon: "puzzle" },
    { to: "/projects", label: "پروژه‌ها", icon: "folder" },
    { to: "/activities", label: "فعالیت‌ها", icon: "clock" },
    { to: "/analytics", label: "گزارش‌ها", icon: "chart" },
    { to: "/alerts", label: "هشدارها", icon: "alert" },
    { to: "/copilot", label: "دستیار هوشمند", icon: "bot" },
    { to: "/settings", label: "تنظیمات", icon: "settings" },
];
const LOGO_SRC = `${import.meta.env.BASE_URL}main.png`;

export default function Sidebar({ mobileOpen, onCloseMobile, onRequestLogout }) {
    const { user } = useAuth();
    return (
        <>
            <aside className={`sidebar ${mobileOpen ? "sidebar-mobile-open" : ""}`} aria-label="ناوبری اصلی">
                <div className="sidebar-brand">
                    <img className="sidebar-brand-mark" src={LOGO_SRC} alt="نشان پردازش روبین پرهام" />
                    {
                        <div className="sidebar-brand-text">
                            <div className="sidebar-brand-title">پردازش روبین پرهام</div>
                            <div className="sidebar-brand-sub">داشبورد پرسنل و پروژه‌ها</div>
                        </div>
                    }
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onCloseMobile}
                            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                            title={item.label}
                        >
                            <span className="sidebar-link-icon"><Icon name={item.icon} size={18} /></span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user"><span className="sidebar-user-avatar">م</span><span><strong>{user?.name}</strong><small>{user?.role}</small></span></div>
                    <button className="sidebar-logout" onClick={onRequestLogout} title="خروج از حساب"><Icon name="logout" size={16} />خروج از سامانه</button>
                </div>
            </aside>
            {mobileOpen && <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />}
        </>
    );
}
