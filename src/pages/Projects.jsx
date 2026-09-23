import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects, getProjectById } from "../data/projects.js";
import { getEmployeeById, employees } from "../data/employees.js";
import { getTasksByProject } from "../data/tasks.js";
import Badge from "../components/ui/Badge.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { projectStatusMap } from "../utils/statusMaps.js";

export default function Projects() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [manager, setManager] = useState("all");

    const managers = useMemo(() => {
        const ids = [...new Set(projects.map((p) => p.managerId))];
        return ids.map((id) => getEmployeeById(id)).filter(Boolean);
    }, []);

    const filtered = useMemo(() => {
        return projects.filter((p) => {
            if (status !== "all" && p.status !== status) return false;
            if (manager !== "all" && p.managerId !== manager) return false;
            if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase()) && !p.client.toLowerCase().includes(query.trim().toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [query, status, manager]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>پروژه‌ها</h1>
                    <p className="page-subtitle">فهرست پروژه‌های سازمان و وضعیت پیشرفت آن‌ها</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="filters-bar">
                <input type="text" placeholder="جستجوی پروژه یا مشتری..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="On Track">طبق برنامه</option>
                    <option value="At Risk">در معرض ریسک</option>
                    <option value="Delayed">تاخیر دار</option>
                    <option value="Completed">تکمیل شده</option>
                </select>
                <select value={manager} onChange={(e) => setManager(e.target.value)}>
                    <option value="all">همه مدیران پروژه</option>
                    {managers.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
                <span className="result-count">{filtered.length} از {projects.length} پروژه</span>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon="📁" title="پروژه‌ای با این فیلتر یافت نشد" />
            ) : (
                <div className="project-card-grid">
                    {filtered.map((p) => {
                        const mgr = getEmployeeById(p.managerId);
                        const st = projectStatusMap[p.status];
                        const openTasks = getTasksByProject(p.id).filter((t) => t.status !== "Done").length;
                        const healthColor = p.health >= 80 ? "var(--color-success)" : p.health >= 60 ? "var(--color-warning)" : "var(--color-danger)";
                        return (
                            <div key={p.id} className="card card-pad project-card" onClick={() => navigate(`/projects/${p.id}`)}>
                                <div className="project-card-top">
                                    <div>
                                        <div className="project-card-name">{p.name}</div>
                                        <div className="project-card-meta">{p.client}</div>
                                    </div>
                                    <Badge className={st.badge}>{st.label}</Badge>
                                </div>
                                <ProgressBar value={p.progress} />
                                <div className="project-card-footer">
                                    <span>پیشرفت {p.progress}٪</span>
                                    <span>{p.memberIds.length} عضو</span>
                                    <span>{openTasks} Task باز</span>
                                </div>
                                <div className="project-card-footer">
                                    <span>مدیر: {mgr?.name}</span>
                                    <span>مهلت: {p.deadline}</span>
                                </div>
                                <div className="project-card-footer">
                                    <span>سلامت پروژه</span>
                                    <span className="health-pill" style={{ color: healthColor }}>{p.health}/100</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
