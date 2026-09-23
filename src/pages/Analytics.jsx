import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { teams } from "../data/teams.js";
import { useData } from "../context/DataContext.jsx";

const employeeGrowth = [
    { month: "فروردین", count: 9 },
    { month: "اردیبهشت", count: 10 },
    { month: "خرداد", count: 11 },
    { month: "تیر", count: 12 },
    { month: "مرداد", count: 13 },
    { month: "شهریور", count: 15 },
];

const hiringTrend = [
    { month: "فروردین", applied: 18, hired: 1 },
    { month: "اردیبهشت", applied: 22, hired: 2 },
    { month: "خرداد", applied: 25, hired: 1 },
    { month: "تیر", applied: 30, hired: 3 },
    { month: "مرداد", applied: 20, hired: 1 },
    { month: "شهریور", applied: 13, hired: 1 },
];

const overdueTrend = [
    { week: "هفته ۱", overdue: 2 },
    { week: "هفته ۲", overdue: 4 },
    { week: "هفته ۳", overdue: 3 },
    { week: "هفته ۴", overdue: 5 },
    { week: "هفته ۵", overdue: 3 },
];

const STATUS_COLORS = { Todo: "#98a2b3", "In Progress": "#2b6cb0", Review: "#b8860b", Blocked: "#b23b3b", Done: "#1f8a5f" };

export default function Analytics() {
    const { employees, tasks, projects } = useData();
    const taskStatusData = Object.keys(STATUS_COLORS).map((status) => ({
        name: status,
        value: tasks.filter((t) => t.status === status).length,
    }));

    const projectProgressData = projects.map((p) => ({ name: p.name, progress: p.progress }));

    const workloadData = teams.map((team) => {
        const teamEmployeeIds = employees.filter((e) => e.teamId === team.id).map((e) => e.id);
        const activeTasks = tasks.filter((t) => teamEmployeeIds.includes(t.assigneeId) && t.status !== "Done");
        return { name: team.nameFa, assigned: activeTasks.length * 4, capacity: team.capacity };
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>تحلیل و گزارش</h1>
                    <p className="page-subtitle">نمای تحلیلی مدیریتی از رشد کارکنان، استخدام، پروژه‌ها و بار کاری</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="analytics-grid">
                <div className="card chart-card">
                    <div className="section-title">رشد تعداد کارکنان</div>
                    <ResponsiveContainer width="100%" height={270}>
                        <AreaChart data={employeeGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: "ماه", position: "insideBottom", offset: -8 }} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: "تعداد نفر", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#1f3a5f" fill="#dce6f2" name="کارکنان" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <div className="section-title">روند جذب و استخدام</div>
                    <ResponsiveContainer width="100%" height={270}>
                        <LineChart data={hiringTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: "ماه", position: "insideBottom", offset: -8 }} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: "تعداد", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Line type="monotone" dataKey="applied" stroke="#3a6ea5" name="رزومه دریافتی" />
                            <Line type="monotone" dataKey="hired" stroke="#1f8a5f" name="استخدام‌شده" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <div className="section-title">پیشرفت پروژه‌ها</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={projectProgressData} layout="vertical" margin={{ left: 16, right: 28, top: 8, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} label={{ value: "درصد پیشرفت", position: "insideBottom", offset: -4 }} />
                            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} label={{ value: "پروژه", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                            <Tooltip />
                            <Bar dataKey="progress" fill="#3a6ea5" radius={[0, 6, 6, 0]} name="پیشرفت (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <div className="section-title">توزیع وضعیت Taskها</div>
                    <ResponsiveContainer width="100%" height={270}>
                        <PieChart>
                            <Pie data={taskStatusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                                {taskStatusData.map((entry) => (
                                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <div className="section-title">روند Taskهای دارای تاخیر</div>
                    <ResponsiveContainer width="100%" height={270}>
                        <LineChart data={overdueTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                            <XAxis dataKey="week" tick={{ fontSize: 11 }} label={{ value: "بازه زمانی", position: "insideBottom", offset: -8 }} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: "تعداد Task", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="overdue" stroke="#b23b3b" name="تعداد Task عقب‌افتاده" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <div className="section-title">بار کاری تیم‌ها</div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={workloadData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} label={{ value: "تیم", position: "insideBottom", offset: -8 }} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: "ساعت/واحد بار", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="assigned" fill="#3a6ea5" name="بار تخصیص‌یافته" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="capacity" fill="#cbd3df" name="ظرفیت" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
