import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { employees } from "../data/employees.js";
import { teams } from "../data/teams.js";
import { getTasksByEmployee } from "../data/tasks.js";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { employeeStatusMap } from "../utils/statusMaps.js";

export default function Employees() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState(params.get("status") || "all");
    const [team, setTeam] = useState(params.get("team") || "all");

    const filtered = useMemo(() => {
        return employees.filter((e) => {
            if (status !== "all" && e.status !== status) return false;
            if (team !== "all" && e.teamId !== team) return false;
            if (query.trim()) {
                const q = query.trim().toLowerCase();
                if (!e.name.toLowerCase().includes(q) && !e.role.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [query, status, team]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>کارکنان</h1>
                    <p className="page-subtitle">فهرست کارکنان فعال سازمان و وضعیت اشتغال آن‌ها</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
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
                <span className="result-count">{filtered.length} نفر از {employees.length} کارمند</span>
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
        </div>
    );
}
