import React, { useEffect, useState } from "react";
import GlobalSearch from "./GlobalSearch.jsx";
import { useApp } from "../../context/AppContext.jsx";

const WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

function useClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000 * 30);
        return () => clearInterval(id);
    }, []);
    return now;
}

export default function Topbar({ onOpenMobileSidebar }) {
    const now = useClock();
    const { role, setRole, currentRole, presentationMode, setPresentationMode } = useApp();

    const timeStr = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    const weekday = WEEKDAYS[now.getDay()];

    return (
        <header className="topbar">
            <button className="topbar-mobile-toggle" onClick={onOpenMobileSidebar}>☰</button>
            <GlobalSearch />
            <div className="topbar-right">
                <div className="topbar-clock">
                    <span className="topbar-clock-time">{timeStr}</span>
                    <span className="faint">{weekday}</span>
                </div>
                <select className="role-select" value={role} onChange={(e) => setRole(e.target.value)} title="نقش کاربری (مفهومی)">
                    <option value="executive">Executive</option>
                    <option value="hr">HR</option>
                    <option value="pm">Project Manager</option>
                    <option value="lead">Team Lead</option>
                    <option value="employee">Employee</option>
                </select>
                <button
                    className={`btn btn-sm ${presentationMode ? "btn-primary" : ""}`}
                    onClick={() => setPresentationMode((v) => !v)}
                    title="حالت ارائه برای نمایش به مدیران"
                >
                    🖥️ حالت ارائه
                </button>
            </div>
        </header>
    );
}
