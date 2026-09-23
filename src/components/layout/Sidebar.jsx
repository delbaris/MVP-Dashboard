import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";

const NAV_ITEMS = [
    { to: "/", label: "مرکز فرماندهی", icon: "🧭", end: true },
    { to: "/employees", label: "کارکنان", icon: "👥" },
    { to: "/recruitment", label: "جذب و استخدام", icon: "🧩" },
    { to: "/projects", label: "پروژه‌ها", icon: "📁" },
    { to: "/activities", label: "فعالیت‌ها", icon: "🕒" },
    { to: "/analytics", label: "تحلیل و گزارش", icon: "📊" },
    { to: "/alerts", label: "هشدارها", icon: "🚨" },
    { to: "/copilot", label: "AI Copilot", icon: "🤖" },
    { to: "/settings", label: "تنظیمات", icon: "⚙️" },
];

export default function Sidebar({ compact, onToggleCompact, mobileOpen, onCloseMobile }) {
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
                            <span className="sidebar-link-icon">{item.icon}</span>
                            {!compact && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <button className="sidebar-toggle" onClick={onToggleCompact}>
                    {compact ? "»" : "« جمع کردن"}
                </button>
            </aside>
            {mobileOpen && <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />}
        </>
    );
}
