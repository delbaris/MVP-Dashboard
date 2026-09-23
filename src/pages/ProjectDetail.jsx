import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTasksByProject } from "../data/tasks.js";
import { getActivitiesByProject } from "../data/activities.js";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import EntityModal from "../components/ui/EntityModal.jsx";
import { projectStatusMap, taskStatusMap, priorityMap, severityMap } from "../utils/statusMaps.js";
import { useData } from "../context/DataContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import Icon from "../components/ui/Icon.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import { toPersianDigits } from "../utils/jalali.js";
import ProjectStructure from "../components/project/ProjectStructure.jsx";
import { formatDemoMoney, getProjectFinancials } from "../utils/projectFinancials.js";

const TABS = [
    { key: "overview", label: "نمای کلی" },
    { key: "structure", label: "ساختار و منابع" },
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
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTask, setDeletingTask] = useState(null);
    const { projects, employees, tasks: taskRecords, addRecord, updateRecord, deleteRecord } = useData();
    const { pushToast } = useApp();
    const project = projects.find((record) => record.id === id);

    if (!project) {
        return <EmptyState icon="📁" title="پروژه یافت نشد" subtitle="این شناسه در داده‌های دمو موجود نیست." action={<button className="btn btn-primary" onClick={() => navigate("/projects")}>بازگشت به فهرست پروژه‌ها</button>} />;
    }

    const manager = employees.find((employee) => employee.id === project.managerId);
    const members = project.memberIds.map((mid) => employees.find((employee) => employee.id === mid)).filter(Boolean);
    const tasks = taskRecords.filter((task) => task.projectId === project.id);
    const activities = getActivitiesByProject(project.id);
    const st = projectStatusMap[project.status];
    const healthColor = project.health >= 80 ? "var(--color-success)" : project.health >= 60 ? "var(--color-warning)" : "var(--color-danger)";
    const financials = getProjectFinancials(project);
    const taskProgress = tasks.length ? Math.round(tasks.reduce((sum, task) => sum + Number(task.progress || 0), 0) / tasks.length) : 0;

    return (
        <div>
            <Breadcrumbs items={[{ label: "پروژه‌ها", to: "/projects" }, { label: project.name }]} />
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
                    <span style={{ fontWeight: 700 }}>{toPersianDigits(project.progress)}٪</span>
                </div>

                <div className="project-finance-strip card card-pad">
                    <div>
                        <span className="project-finance-label">بودجه برنامه‌ریزی‌شده</span>
                        <strong>{formatDemoMoney(financials.plannedBudget)}</strong>
                    </div>
                    <div>
                        <span className="project-finance-label">هزینه مصرف‌شده</span>
                        <strong>{formatDemoMoney(financials.actualCost)}</strong>
                    </div>
                    <div>
                        <span className="project-finance-label">مانده بودجه</span>
                        <strong>{formatDemoMoney(financials.remainingBudget)}</strong>
                    </div>
                    <div>
                        <span className="project-finance-label">ساعت واقعی / برنامه</span>
                        <strong>{toPersianDigits(financials.actualHours)} / {toPersianDigits(financials.plannedHours)}</strong>
                    </div>
                    <small className="project-finance-source">منبع: {financials.source} · هزینه واقعی در فاز Backend از TimeEntry تأییدشده محاسبه می‌شود.</small>
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
                    <div className="card-title-row">
                        <h3>Taskهای پروژه</h3>
                        <button type="button" className="btn btn-sm btn-primary" onClick={() => { setEditingTask(null); setTaskFormOpen(true); }}>افزودن Task</button>
                    </div>
                    <div className="section-title">توضیحات پروژه</div>
                    <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>{project.description}</p>
                    <div className="stat-mini-grid">
                        <div className="stat-mini">
                            <div className="stat-mini-value">{members.length}</div>
                            <div className="stat-mini-label">اعضای تیم</div>
                        </div>
                        <div className="stat-mini">
                            <div className="stat-mini-value">{toPersianDigits(tasks.filter((t) => t.status !== "Done").length)}</div>
                            <div className="stat-mini-label">Taskهای باز</div>
                        </div>
                        <div className="stat-mini">
                            <div className="stat-mini-value">{toPersianDigits(project.milestones.length)}</div>
                            <div className="stat-mini-label">Milestoneها</div>
                        </div>
                        <div className="stat-mini">
                            <div className="stat-mini-value">{toPersianDigits(project.risks.length)}</div>
                            <div className="stat-mini-label">ریسک شناسایی‌شده</div>
                        </div>
                    </div>
                </div>
            )}

            {tab === "structure" && (
                <div className="vstack" style={{ gap: 16 }}>
                    <div className="card card-pad">
                        <div className="card-title-row">
                            <div>
                                <h3>درخت تیم و مسئولیت‌ها</h3>
                                <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>نمای شماتیک مدیر پروژه، افراد درگیر و Taskهای هر نفر</p>
                            </div>
                            <span className="proto-badge">داده دمو · آماده اتصال به API</span>
                        </div>
                        <ProjectStructure manager={manager} members={members} tasks={tasks} />
                    </div>
                    <div className="card card-pad">
                        <div className="card-title-row">
                            <h3>مصرف منابع و بودجه</h3>
                            <span className="muted" style={{ fontSize: 12 }}>انحراف هزینه: {toPersianDigits(financials.budgetVariance.toFixed(1))}٪</span>
                        </div>
                        <div className="project-resource-grid">
                            <div>
                                <div className="hstack" style={{ justifyContent: "space-between" }}><span>پیشرفت پروژه</span><strong>{toPersianDigits(project.progress)}٪</strong></div>
                                <ProgressBar value={project.progress} />
                            </div>
                            <div>
                                <div className="hstack" style={{ justifyContent: "space-between" }}><span>پیشرفت Taskها</span><strong>{toPersianDigits(taskProgress)}٪</strong></div>
                                <ProgressBar value={taskProgress} />
                            </div>
                            <div>
                                <div className="hstack" style={{ justifyContent: "space-between" }}><span>مصرف ساعت</span><strong>{toPersianDigits(Math.round((financials.actualHours / financials.plannedHours) * 100))}٪</strong></div>
                                <ProgressBar value={Math.min(Math.round((financials.actualHours / financials.plannedHours) * 100), 100)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <EntityModal
                open={taskFormOpen}
                onClose={() => { setTaskFormOpen(false); setEditingTask(null); }}
                title={editingTask ? "ویرایش Task" : "افزودن Task"}
                fields={[
                    { name: "title", label: "عنوان Task", required: true },
                    { name: "assigneeId", label: "مسئول", type: "select", required: true, options: employees.map((employee) => ({ value: employee.id, label: employee.name })) },
                    { name: "status", label: "وضعیت", type: "select", required: true, options: [{ value: "Todo", label: "برای انجام" }, { value: "In Progress", label: "در حال انجام" }, { value: "Review", label: "در بررسی" }, { value: "Blocked", label: "مسدود" }, { value: "Done", label: "تکمیل شده" }] },
                    { name: "priority", label: "اولویت", type: "select", required: true, options: [{ value: "بالا", label: "بالا" }, { value: "متوسط", label: "متوسط" }, { value: "کم", label: "کم" }] },
                    { name: "dueDate", label: "موعد تحویل", type: "date", required: true },
                ]}
                initialValues={editingTask || { assigneeId: employees[0]?.id || "", status: "Todo", priority: "متوسط", progress: 0 }}
                onSubmit={(values) => {
                    if (editingTask) {
                        updateRecord("tasks", editingTask.id, values);
                        pushToast("Task با موفقیت ویرایش شد", "success");
                    } else {
                        addRecord("tasks", { ...values, id: `task-demo-${Date.now()}`, projectId: project.id, progress: 0, createdAt: "امروز", lastUpdate: "امروز" });
                        pushToast("Task جدید با موفقیت ثبت شد", "success");
                    }
                    setEditingTask(null);
                }}
            />
            <ConfirmDialog
                open={!!deletingTask}
                onClose={() => setDeletingTask(null)}
                title="حذف Task"
                description={`آیا از حذف «${deletingTask?.title || ""}» مطمئن هستید؟`}
                onConfirm={() => { deleteRecord("tasks", deletingTask.id); setDeletingTask(null); pushToast("Task با موفقیت حذف شد", "success"); }}
            />

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
                                        <th>عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((t) => {
                                        const assignee = employees.find((employee) => employee.id === t.assigneeId);
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
                                                <td>
                                                    <div className="table-actions" onClick={(event) => event.stopPropagation()}>
                                                        <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setEditingTask(t); setTaskFormOpen(true); }}><Icon name="edit" size={14} /> ویرایش</button>
                                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => setDeletingTask(t)}><Icon name="trash" size={14} /> حذف</button>
                                                    </div>
                                                </td>
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
                                const emp = employees.find((employee) => employee.id === act.employeeId);
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
