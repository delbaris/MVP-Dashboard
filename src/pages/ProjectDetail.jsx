import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../data/projects.js";
import { getEmployeeById } from "../data/employees.js";
import { getTasksByProject } from "../data/tasks.js";
import { getActivitiesByProject } from "../data/activities.js";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { projectStatusMap, taskStatusMap, priorityMap, severityMap } from "../utils/statusMaps.js";

const TABS = [
    { key: "overview", label: "نمای کلی" },
    { key: "team", label: "اعضای تیم" },
    { key: "milestones", label: "Milestoneها" },
    { key: "tasks", label: "Taskها" },
    { key: "activity", label: "فعالیت" },
    { key: "risks", label: "ریسک‌ها" },
];

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState("overview");
    const project = getProjectById(id);

    if (!project) {
        return <EmptyState icon="📁" title="پروژه یافت نشد" subtitle="این شناسه در Mock Data موجود نیست." />;
    }

    const manager = getEmployeeById(project.managerId);
    const members = project.memberIds.map((mid) => getEmployeeById(mid)).filter(Boolean);
    const tasks = getTasksByProject(project.id);
    const activities = getActivitiesByProject(project.id);
    const st = projectStatusMap[project.status];
    const healthColor = project.health >= 80 ? "var(--color-success)" : project.health >= 60 ? "var(--color-warning)" : "var(--color-danger)";

    return (
        <div>
            <div className="back-link" onClick={() => navigate("/projects")}>→ بازگشت به فهرست پروژه‌ها</div>

            <div className="detail-header card card-pad">
                <div className="detail-header-info">
                    <h1>{project.name}</h1>
                    <div className="muted">{project.client}</div>
                    <div className="detail-header-meta">
                        <span>مدیر پروژه: {manager?.name}</span>
                        <span>تاریخ شروع: {project.startDate}</span>
                        <span>مهلت: {project.deadline}</span>
                        <span>سلامت: <strong style={{ color: healthColor }}>{project.health}/100</strong></span>
                    </div>
                </div>
                <div className="detail-header-actions">
                    <Badge className={st.badge}>{st.label}</Badge>
                </div>
            </div>

            <div className="card card-pad" style={{ marginBottom: 20 }}>
                <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                    <span className="section-title" style={{ margin: 0 }}>پیشرفت کلی پروژه</span>
                    <span style={{ fontWeight: 700 }}>{project.progress}٪</span>
                </div>
                <ProgressBar value={project.progress} />
            </div>

            <div className="tabs-bar">
                {TABS.map((t) => (
                    <button key={t.key} className={`tab-btn ${tab === t.key ? "tab-active" : ""}`} onClick={() => setTab(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "overview" && (
                <div className="card card-pad">
                    <div className="section-title">توضیحات پروژه</div>
                    <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>{project.description}</p>
                    <div className="stat-mini-grid">
                        <div className="stat-mini">
                            <div className="stat-mini-value">{members.length}</div>
                            <div className="stat-mini-label">اعضای تیم</div>
                        </div>
                        <div className="stat-mini">
                            <div className="stat-mini-value">{tasks.filter((t) => t.status !== "Done").length}</div>
                            <div className="stat-mini-label">Taskهای باز</div>
                        </div>
                        <div className="stat-mini">
                            <div className="stat-mini-value">{project.milestones.length}</div>
                            <div className="stat-mini-label">Milestoneها</div>
                        </div>
                        <div className="stat-mini">
                            <div className="stat-mini-value">{project.risks.length}</div>
                            <div className="stat-mini-label">ریسک شناسایی‌شده</div>
                        </div>
                    </div>
                </div>
            )}

            {tab === "team" && (
                <div className="card">
                    {members.length === 0 ? (
                        <EmptyState icon="👥" title="عضوی برای این پروژه ثبت نشده است" />
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>عضو</th>
                                        <th>سمت</th>
                                        <th>وضعیت</th>
                                        <th>Taskهای این پروژه</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((m) => (
                                        <tr key={m.id} onClick={() => navigate(`/employees/${m.id}`)}>
                                            <td>
                                                <div className="person-cell">
                                                    <Avatar name={m.name} color={m.avatarColor} size="sm" />
                                                    <span className="person-name">{m.name}</span>
                                                </div>
                                            </td>
                                            <td>{m.role}</td>
                                            <td>{m.status}</td>
                                            <td>{tasks.filter((t) => t.assigneeId === m.id).length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {tab === "milestones" && (
                <div className="card card-pad">
                    {project.milestones.length === 0 ? (
                        <EmptyState icon="🚩" title="Milestoneای ثبت نشده است" />
                    ) : (
                        project.milestones.map((m, i) => {
                            const color =
                                m.status === "Done" ? "var(--color-success)" : m.status === "Delayed" ? "var(--color-danger)" : m.status === "In Progress" ? "var(--color-info)" : "var(--color-text-faint)";
                            return (
                                <div key={i} className="milestone-row">
                                    <span className="milestone-dot" style={{ background: color }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.title}</div>
                                        <div className="faint" style={{ fontSize: 11.5 }}>{m.date}</div>
                                    </div>
                                    <span style={{ fontSize: 12, color, fontWeight: 700 }}>{m.status}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {tab === "tasks" && (
                <div className="card">
                    {tasks.length === 0 ? (
                        <EmptyState icon="🗂️" title="Taskی برای این پروژه ثبت نشده است" />
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>مسئول</th>
                                        <th>اولویت</th>
                                        <th>وضعیت</th>
                                        <th>پیشرفت</th>
                                        <th>مهلت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((t) => {
                                        const assignee = getEmployeeById(t.assigneeId);
                                        const ts = taskStatusMap[t.status];
                                        const pr = priorityMap[t.priority];
                                        return (
                                            <tr key={t.id} onClick={() => assignee && navigate(`/employees/${assignee.id}`)}>
                                                <td style={{ fontWeight: 600 }}>{t.title}</td>
                                                <td>{assignee?.name}</td>
                                                <td><Badge className={pr.badge}>{t.priority}</Badge></td>
                                                <td><Badge className={ts.badge}>{ts.label}</Badge></td>
                                                <td style={{ minWidth: 120 }}><ProgressBar value={t.progress} /></td>
                                                <td>{t.dueDate}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {tab === "activity" && (
                <div className="card card-pad">
                    {activities.length === 0 ? (
                        <EmptyState icon="🕒" title="فعالیتی برای این پروژه ثبت نشده است" />
                    ) : (
                        <div className="timeline">
                            {activities.map((act) => {
                                const emp = getEmployeeById(act.employeeId);
                                return (
                                    <div key={act.id} className="timeline-item" onClick={() => emp && navigate(`/employees/${emp.id}`)}>
                                        <div className="timeline-time">{act.time}</div>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <div className="hstack" style={{ marginBottom: 3 }}>
                                                <Avatar name={emp?.name} color={emp?.avatarColor} size="sm" />
                                                <span style={{ fontWeight: 600 }}>{emp?.name}</span>
                                                <span className="tag">{act.type}</span>
                                            </div>
                                            <div className="muted" style={{ fontSize: 12.5 }}>{act.description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {tab === "risks" && (
                <div className="card card-pad">
                    {project.risks.length === 0 ? (
                        <EmptyState icon="✅" title="ریسک فعالی برای این پروژه ثبت نشده است" />
                    ) : (
                        project.risks.map((r, i) => {
                            const sev = severityMap[r.severity];
                            return (
                                <div key={i} className="risk-row">
                                    <span className="alert-icon">⚠</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.risk}</div>
                                        <div className="muted" style={{ fontSize: 12.5 }}>راهکار کاهش ریسک: {r.mitigation}</div>
                                        <div className="faint" style={{ fontSize: 11.5, marginTop: 4 }}>مسئول: {r.owner}</div>
                                    </div>
                                    <Badge className={sev.badge}>{r.severity}</Badge>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
