import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../ui/Icon.jsx";

const NAV_ITEMS = [
    { to: "/", label: "مرکز فرماندهی", icon: "compass", end: true },
    { to: "/employees", label: "کارکنان", icon: "users" },
    { to: "/recruitment", label: "جذب و استخدام", icon: "puzzle" },
    { to: "/projects", label: "پروژه‌ها", icon: "folder" },
    { to: "/activities", label: "فعالیت‌ها", icon: "clock" },
    { to: "/analytics", label: "تحلیل و گزارش", icon: "chart" },
    { to: "/alerts", label: "هشدارها", icon: "alert" },
    { to: "/copilot", label: "AI Copilot", icon: "bot" },
    { to: "/settings", label: "تنظیمات", icon: "settings" },
];

export default function Sidebar({ compact, onToggleCompact, mobileOpen, onCloseMobile }) {
    const { user, logout } = useAuth();
    return (
        <>
            <aside className={`sidebar ${compact ? "sidebar-compact" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-mark">EP</div>
                    {!compact && (
                        <div className="sidebar-brand-text">
                            <div className="sidebar-brand-title">Ops Command Center</div>
                            <div className="sidebar-brand-sub">مرکز فرماندهی کارکنان و پروژه‌ها</div>
                        </div>
                    )}
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onCloseMobile}
                            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                            title={compact ? item.label : undefined}
                        >
                            <span className="sidebar-link-icon"><Icon name={item.icon} size={18} /></span>
                            {!compact && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {!compact && <div className="sidebar-user"><span className="sidebar-user-avatar">م</span><span><strong>{user?.name}</strong><small>{user?.role}</small></span></div>}
                    <button className="sidebar-toggle" onClick={onToggleCompact} title={compact ? "باز کردن سایدبار" : "جمع کردن سایدبار"}>
                        {compact ? "»" : "« جمع کردن"}
                    </button>
                    <button className="sidebar-logout" onClick={logout} title="خروج از حساب"><Icon name="logout" size={16} />{!compact && "خروج"}</button>
                </div>
            </aside>
            {mobileOpen && <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />}
        </>
    );
}
