import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { employees } from "../data/employees.js";
import { teams } from "../data/teams.js";
import { getTasksByEmployee } from "../data/tasks.js";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { employeeStatusMap } from "../utils/statusMaps.js";
import EntityModal from "../components/ui/EntityModal.jsx";
import Icon from "../components/ui/Icon.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Employees() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState(params.get("status") || "all");
    const [team, setTeam] = useState(params.get("team") || "all");
    const [formOpen, setFormOpen] = useState(false);
    const { employees: employeeRecords, addRecord } = useData();

    const filtered = useMemo(() => {
        return employeeRecords.filter((e) => {
            if (status !== "all" && e.status !== status) return false;
            if (team !== "all" && e.teamId !== team) return false;
            if (query.trim()) {
                const q = query.trim().toLowerCase();
                if (!e.name.toLowerCase().includes(q) && !e.role.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [employeeRecords, query, status, team]);

    const employeeFields = [
        { name: "name", label: "نام و نام خانوادگی", required: true, placeholder: "مثلاً مریم احمدی" },
        { name: "email", label: "ایمیل سازمانی", type: "email", required: true },
        { name: "role", label: "سمت", required: true },
        { name: "location", label: "محل استقرار", required: true, placeholder: "تهران / دبی" },
        { name: "status", label: "وضعیت", type: "select", required: true, options: [{ value: "Active", label: "فعال" }, { value: "Onboarding", label: "در حال ورود" }, { value: "Available", label: "آماده تخصیص" }] },
        { name: "hireDate", label: "تاریخ شروع", required: true, placeholder: "1405-01-01" },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>پرسنل</h1>
                    <p className="page-subtitle">فهرست کارکنان فعال سازمان و وضعیت اشتغال آن‌ها</p>
                </div>
                <button className="btn btn-primary" onClick={() => setFormOpen(true)}><Icon name="users" size={16} /> ثبت پرسنل</button>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="جستجوی نام یا سمت..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="Active">فعال</option>
                    <option value="Onboarding">در حال آنبوردینگ</option>
                    <option value="Available">بدون تخصیص</option>
                    <option value="Inactive">غیرفعال</option>
                </select>
                <select value={team} onChange={(e) => setTeam(e.target.value)}>
                    <option value="all">همه تیم‌ها</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id}>{t.nameFa}</option>
                    ))}
                </select>
                <span className="result-count">{filtered.length} نفر از {employeeRecords.length} نفر</span>
            </div>

            <div className="card">
                {filtered.length === 0 ? (
                    <EmptyState icon="👥" title="کارمندی با این فیلتر یافت نشد" subtitle="فیلترها را تغییر دهید." />
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>کارمند</th>
                                    <th>تیم</th>
                                    <th>مدیر مستقیم</th>
                                    <th>وضعیت</th>
                                    <th>Taskهای باز</th>
                                    <th>محل استقرار</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((e) => {
                                    const teamInfo = teams.find((t) => t.id === e.teamId);
                                    const manager = employees.find((m) => m.id === e.managerId);
                                    const openTasks = getTasksByEmployee(e.id).filter((t) => t.status !== "Done").length;
                                    const st = employeeStatusMap[e.status];
                                    return (
                                        <tr key={e.id} onClick={() => navigate(`/employees/${e.id}`)}>
                                            <td>
                                                <div className="person-cell">
                                                    <Avatar name={e.name} color={e.avatarColor} />
                                                    <div>
                                                        <div className="person-name">{e.name}</div>
                                                        <div className="person-sub">{e.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{teamInfo?.nameFa || "—"}</td>
                                            <td>{manager ? manager.name : "—"}</td>
                                            <td><Badge className={st.badge}>{st.label}</Badge></td>
                                            <td>{openTasks}</td>
                                            <td>{e.location}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <EntityModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title="ثبت پرسنل جدید"
                description="اطلاعات پایه را وارد کنید؛ جزئیات تخصیص پروژه و مهارت‌ها بعداً از پروفایل فرد تکمیل می‌شود."
                fields={employeeFields}
                initialValues={{ status: "Active" }}
                onSubmit={(values) => addRecord("employees", { ...values, id: `emp-demo-${Date.now()}`, avatarColor: "#3a6ea5", title: values.role, teamId: "team-management", managerId: "emp-01", phone: "", skills: [] })}
            />
        </div>
    );
}
