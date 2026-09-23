import React, { useEffect, useState } from "react";
import GlobalSearch from "./GlobalSearch.jsx";
import { useApp } from "../../context/AppContext.jsx";
import Icon from "../ui/Icon.jsx";

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

    const dateStr = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }).format(now);
    const weekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long" }).format(now);
    const timeStr = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);

    return (
        <header className="topbar">
            <button className="topbar-mobile-toggle" onClick={onOpenMobileSidebar} aria-label="باز کردن منو"><Icon name="menu" /></button>
            <GlobalSearch />
            <div className="topbar-right">
                <div className="topbar-clock" aria-label={`زمان فعلی: ${weekday}، ${dateStr}، ${timeStr}`}>
                    <span className="topbar-clock-time">{timeStr}</span>
                    <span className="faint topbar-clock-date">{weekday}، {dateStr}</span>
                </div>
                <select className="role-select" value={role} onChange={(e) => setRole(e.target.value)} title="نقش کاربری (مفهومی)">
                    <option value="executive">مدیر ارشد</option>
                    <option value="hr">منابع انسانی</option>
                    <option value="pm">مدیر پروژه</option>
                    <option value="lead">سرپرست تیم</option>
                    <option value="employee">کارمند</option>
                </select>
                <button
                    className={`btn btn-sm ${presentationMode ? "btn-primary" : ""}`}
                    onClick={() => setPresentationMode((v) => !v)}
                    title="حالت ارائه برای نمایش به مدیران"
                >
                    <Icon name="presentation" size={16} /> <span className="topbar-action-label">{presentationMode ? "خروج از ارائه" : "حالت ارائه"}</span>
                </button>
                <button className="btn btn-sm btn-ghost topbar-logout" onClick={onRequestLogout} title="خروج از حساب"><Icon name="logout" size={16} /> <span className="topbar-action-label">خروج</span></button>
            </div>
        </header>
    );
}
