import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasksByProject } from "../data/tasks.js";
import Badge from "../components/ui/Badge.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { projectStatusMap } from "../utils/statusMaps.js";
import EntityModal from "../components/ui/EntityModal.jsx";
import Icon from "../components/ui/Icon.jsx";
import { toPersianDigits } from "../utils/jalali.js";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Projects() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [manager, setManager] = useState("all");
    const [formOpen, setFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProject, setDeletingProject] = useState(null);
    const { projects: projectRecords, employees: employeeRecords, addRecord, updateRecord, deleteRecord } = useData();
    const { pushToast } = useApp();

    const managers = useMemo(() => {
        const ids = [...new Set(projectRecords.map((p) => p.managerId))];
        return ids.map((id) => employeeRecords.find((employee) => employee.id === id)).filter(Boolean);
    }, [projectRecords, employeeRecords]);

    const filtered = useMemo(() => {
        return projectRecords.filter((p) => {
            if (status !== "all" && p.status !== status) return false;
            if (manager !== "all" && p.managerId !== manager) return false;
            if (query.trim() && !p.name.toLowerCase().includes(query.trim().toLowerCase()) && !p.client.toLowerCase().includes(query.trim().toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [projectRecords, query, status, manager]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>پروژه‌ها</h1>
                    <p className="page-subtitle">فهرست پروژه‌های سازمان و وضعیت پیشرفت آن‌ها</p>
                </div>
                <button className="btn btn-primary" onClick={() => setFormOpen(true)}><Icon name="folder" size={16} /> ثبت پروژه</button>
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
                <span className="result-count">{toPersianDigits(filtered.length)} از {toPersianDigits(projectRecords.length)} پروژه</span>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon="📁" title="پروژه‌ای با این فیلتر یافت نشد" />
            ) : (
                <div className="project-card-grid">
                    {filtered.map((p) => {
                        const mgr = employeeRecords.find((employee) => employee.id === p.managerId);
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
                                    <span>پیشرفت {toPersianDigits(p.progress)}٪</span>
                                    <span>{toPersianDigits(p.memberIds.length)} عضو</span>
                                    <span>{toPersianDigits(openTasks)} Task باز</span>
                                </div>
                                <div className="project-card-footer">
                                    <span>مدیر: {mgr?.name}</span>
                                    <span>مهلت: {p.deadline}</span>
                                </div>
                                <div className="project-card-footer">
                                    <span>سلامت پروژه</span>
                                    <span className="health-pill" style={{ color: healthColor }}>{toPersianDigits(p.health)}/۱۰۰</span>
                                </div>
                                <div className="table-actions" onClick={(event) => event.stopPropagation()}>
                                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setEditingProject(p); setFormOpen(true); }}><Icon name="edit" size={14} /> ویرایش</button>
                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => setDeletingProject(p)}><Icon name="trash" size={14} /> حذف</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <EntityModal
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditingProject(null); }}
                title={editingProject ? "ویرایش پروژه" : "ثبت پروژه جدید"}
                description="اطلاعات پایه پروژه را ثبت کنید؛ اعضا، WBS، کارها و ریسک‌ها از صفحه جزئیات تکمیل می‌شوند."
                fields={[
                    { name: "name", label: "نام پروژه", required: true },
                    { name: "client", label: "مشتری / واحد درخواست‌کننده", required: true },
                    { name: "managerId", label: "مدیر پروژه", type: "select", required: true, options: managers.map((m) => ({ value: m.id, label: m.name })) },
                    { name: "status", label: "وضعیت", type: "select", required: true, options: [{ value: "On Track", label: "طبق برنامه" }, { value: "At Risk", label: "در معرض ریسک" }, { value: "Delayed", label: "تاخیر" }] },
                    { name: "startDate", label: "تاریخ شروع", type: "date", required: true },
                    { name: "deadline", label: "موعد تحویل", type: "date", required: true },
                    { name: "description", label: "شرح پروژه", type: "textarea" },
                ]}
                initialValues={editingProject || { status: "On Track", managerId: managers[0]?.id || "" }}
                onSubmit={(values) => {
                    if (editingProject) {
                        updateRecord("projects", editingProject.id, values);
                        pushToast("اطلاعات پروژه با موفقیت ویرایش شد", "success");
                    } else {
                        addRecord("projects", { ...values, id: `proj-demo-${Date.now()}`, health: 100, progress: 0, memberIds: [], milestones: [], risks: [] });
                        pushToast("پروژه جدید با موفقیت ثبت شد", "success");
                    }
                    setEditingProject(null);
                }}
            />
            <ConfirmDialog
                open={!!deletingProject}
                onClose={() => setDeletingProject(null)}
                title="حذف پروژه"
                description={`آیا از حذف «${deletingProject?.name || ""}» مطمئن هستید؟`}
                onConfirm={() => { deleteRecord("projects", deletingProject.id); setDeletingProject(null); pushToast("پروژه با موفقیت حذف شد", "success"); }}
            />
        </div>
    );
}
