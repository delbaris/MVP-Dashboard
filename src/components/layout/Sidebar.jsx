import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Icon from "../ui/Icon.jsx";

const NAV_ITEMS = [
    { group: "نمای کلی", items: [{ to: "/", label: "داشبورد", icon: "compass", end: true }, { to: "/activities", label: "مرکز فعالیت‌ها", icon: "clock" }, { to: "/analytics", label: "گزارش‌ها", icon: "chart" }] },
    { group: "مدیریت عملیات", items: [{ to: "/employees", label: "پرسنل", icon: "users" }, { to: "/recruitment", label: "جذب و استخدام", icon: "puzzle" }, { to: "/projects", label: "پروژه‌ها", icon: "folder" }, { to: "/alerts", label: "هشدارها", icon: "alert" }] },
    { group: "ابزارها", items: [{ to: "/copilot", label: "دستیار هوشمند", icon: "bot" }, { to: "/settings", label: "تنظیمات", icon: "settings" }] },
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
                    <button type="button" className="sidebar-mobile-close" onClick={onCloseMobile} aria-label="بستن منو"><Icon name="close" size={17} /></button>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((section) => (
                        <div className="sidebar-section" key={section.group}>
                            <div className="sidebar-section-label">{section.group}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={onCloseMobile}
                                    className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                                    title={item.label}
                                >
                                    <span className="sidebar-link-icon"><Icon name={item.icon} size={17} /></span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                    <div className="sidebar-pinned">
                        <div className="sidebar-section-label">سنجاق‌شده</div>
                        <NavLink to="/projects" onClick={onCloseMobile} className="sidebar-pinned-link">
                            <Icon name="message" size={16} />
                            <span>نمای پروژه‌ها و منابع</span>
                        </NavLink>
                    </div>
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
