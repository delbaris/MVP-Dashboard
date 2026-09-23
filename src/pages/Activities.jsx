import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activities } from "../data/activities.js";
import { employees, getEmployeeById } from "../data/employees.js";
import { projects } from "../data/projects.js";
import Avatar from "../components/ui/Avatar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { toPersianDigits } from "../utils/jalali.js";

const ACTIVITY_TYPES = [
    "Task Update",
    "Project Update",
    "Milestone",
    "Interview",
    "Onboarding",
    "Performance Review",
    "Comment",
    "Status Change",
];

export default function Activities() {
    const navigate = useNavigate();
    const [employeeFilter, setEmployeeFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    const dates = useMemo(() => [...new Set(activities.map((a) => a.date))].sort().reverse(), []);

    const filtered = useMemo(() => {
        return activities.filter((a) => {
            if (employeeFilter !== "all" && a.employeeId !== employeeFilter) return false;
            if (projectFilter !== "all" && a.projectId !== projectFilter) return false;
            if (typeFilter !== "all" && a.type !== typeFilter) return false;
            if (dateFilter !== "all" && a.date !== dateFilter) return false;
            return true;
        });
    }, [employeeFilter, projectFilter, typeFilter, dateFilter]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>مرکز فعالیت‌ها</h1>
                    <p className="page-subtitle">تایم‌لاین شفاف فعالیت‌های کاری در سطح سازمان (بدون نظارت پنهانی)</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="card card-pad" style={{ marginBottom: 18 }}>
                <div className="activity-filters">
                    <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
                        <option value="all">همه کارکنان</option>
                        {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                    <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
                        <option value="all">همه پروژه‌ها</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">همه نوع فعالیت‌ها</option>
                        {ACTIVITY_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                        <option value="all">همه تاریخ‌ها</option>
                        {dates.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div className="result-count" style={{ marginTop: 10 }}>{toPersianDigits(filtered.length)} فعالیت از {toPersianDigits(activities.length)} فعالیت ثبت‌شده</div>
            </div>

            <div className="card card-pad">
                {filtered.length === 0 ? (
                    <EmptyState icon="🕒" title="فعالیتی با این فیلتر یافت نشد" />
                ) : (
                    <div className="timeline">
                        {filtered.map((act) => {
                            const emp = getEmployeeById(act.employeeId);
                            const proj = projects.find((p) => p.id === act.projectId);
                            return (
                                <div key={act.id} className="timeline-item" onClick={() => emp && navigate(`/employees/${emp.id}`)}>
                                    <div className="timeline-time">{act.time}</div>
                                    <div className="timeline-dot" />
                                    <div className="timeline-content">
                                        <div className="hstack" style={{ marginBottom: 3, flexWrap: "wrap" }}>
                                            <Avatar name={emp?.name} color={emp?.avatarColor} size="sm" />
                                            <span style={{ fontWeight: 600 }}>{emp?.name}</span>
                                            <span className="tag">{act.type}</span>
                                            {proj && <span className="faint" style={{ fontSize: 11.5 }}>· {proj.name}</span>}
                                            <span className="faint" style={{ fontSize: 11.5, marginRight: "auto" }}>{act.date}</span>
                                        </div>
                                        <div className="muted" style={{ fontSize: 12.5 }}>{act.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
