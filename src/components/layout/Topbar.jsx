import React, { useEffect, useRef, useState } from "react";
import GlobalSearch from "./GlobalSearch.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import { Link } from "react-router-dom";

function useClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return now;
}

export default function Topbar({ onOpenMobileSidebar, onRequestLogout }) {
    const now = useClock();
    const { role, setRole, presentationMode, setPresentationMode } = useApp();
    const { user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const dateStr = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(now);
    const weekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long" }).format(now);
    const timeStr = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);

    useEffect(() => {
        const closeProfile = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
        };
        document.addEventListener("pointerdown", closeProfile);
        return () => document.removeEventListener("pointerdown", closeProfile);
    }, []);

    return (
        <header className="topbar">
            <button className="topbar-mobile-toggle" onClick={onOpenMobileSidebar} aria-label="باز کردن منو"><Icon name="menu" /></button>
            <GlobalSearch />
            <div className="topbar-right">
                <div className="topbar-clock" aria-label={`زمان فعلی: ${weekday}، ${dateStr}، ${timeStr}`}>
                    <span className="topbar-clock-time">{timeStr}</span>
                    <span className="faint topbar-clock-date">{weekday}، {dateStr}</span>
                </div>
                <button
                    className={`btn btn-sm ${presentationMode ? "btn-primary" : ""}`}
                    onClick={() => setPresentationMode((v) => !v)}
                    title="حالت ارائه برای نمایش به مدیران"
                >
                    <Icon name="presentation" size={16} /> <span className="topbar-action-label">{presentationMode ? "خروج از ارائه" : "حالت ارائه"}</span>
                </button>
                <div className="topbar-profile" ref={profileRef}>
                    <button className="topbar-profile-trigger" type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="menu">
                        <Avatar name={user?.name || "مدیر سامانه"} color="#2b6cb0" size="sm" />
                        <span className="topbar-profile-copy">
                            <strong>{user?.name || "مدیر سامانه"}</strong>
                            <small>{user?.role || "مدیر ارشد"}</small>
                        </span>
                        <span className="topbar-profile-chevron" aria-hidden="true">⌄</span>
                    </button>
                    {profileOpen && (
                        <div className="topbar-profile-menu" role="menu">
                            <div className="topbar-profile-menu-heading">نقش کاربری</div>
                            <select className="role-select" value={role} onChange={(e) => setRole(e.target.value)} title="نقش کاربری (مفهومی)">
                                <option value="executive">مدیر ارشد</option>
                                <option value="hr">منابع انسانی</option>
                                <option value="pm">مدیر پروژه</option>
                                <option value="lead">سرپرست تیم</option>
                                <option value="employee">کارمند</option>
                            </select>
                            <Link className="topbar-profile-menu-link" to="/profile" role="menuitem" onClick={() => setProfileOpen(false)}>
                                مشاهده پروفایل من
                            </Link>
                            <button className="topbar-profile-logout" type="button" onClick={() => { setProfileOpen(false); onRequestLogout(); }}>
                                <Icon name="logout" size={16} /> خروج از سامانه
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
