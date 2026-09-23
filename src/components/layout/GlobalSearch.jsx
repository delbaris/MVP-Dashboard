import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employees } from "../../data/employees.js";
import { projects } from "../../data/projects.js";
import { tasks } from "../../data/tasks.js";
import { activities } from "../../data/activities.js";
import Icon from "../ui/Icon.jsx";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const results = useMemo(() => {
        if (!query.trim()) return null;
        const q = query.trim().toLowerCase();
        const emp = employees.filter((e) => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)).slice(0, 4);
        const proj = projects.filter((p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)).slice(0, 4);
        const task = tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 4);
        const act = activities.filter((a) => a.description.toLowerCase().includes(q)).slice(0, 4);
        return { emp, proj, task, act };
    }, [query]);

    function goTo(path) {
        navigate(path);
        setQuery("");
        setOpen(false);
    }

    const hasResults =
        results && (results.emp.length || results.proj.length || results.task.length || results.act.length);

    return (
        <div className="global-search">
            <div className="global-search-input">
                <Icon name="search" size={17} />
                <input
                    placeholder="جستجوی کارمند، پروژه، Task یا فعالیت..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                />
            </div>
            {open && query.trim() && (
                <div className="global-search-results card">
                    {!hasResults && <div style={{ padding: 16, fontSize: 13, color: "var(--color-text-muted)" }}>نتیجه‌ای یافت نشد</div>}
                    {hasResults && (
                        <>
                            {results.emp.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">کارکنان</div>
                                    {results.emp.map((e) => (
                                        <div key={e.id} className="search-result-row" onClick={() => goTo(`/employees/${e.id}`)}>
                                            <span>{e.name}</span>
                                            <span className="faint">{e.role}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {results.proj.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">پروژه‌ها</div>
                                    {results.proj.map((p) => (
                                        <div key={p.id} className="search-result-row" onClick={() => goTo(`/projects/${p.id}`)}>
                                            <span>{p.name}</span>
                                            <span className="faint">{p.client}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {results.task.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">Taskها</div>
                                    {results.task.map((t) => (
                                        <div key={t.id} className="search-result-row" onClick={() => goTo(`/projects/${t.projectId}`)}>
                                            <span>{t.title}</span>
                                            <span className="faint">{t.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {results.act.length > 0 && (
                                <div className="search-group">
                                    <div className="search-group-title">فعالیت‌ها</div>
                                    {results.act.map((a) => (
                                        <div key={a.id} className="search-result-row" onClick={() => goTo(`/activities`)}>
                                            <span>{a.description}</span>
                                            <span className="faint">{a.date}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
