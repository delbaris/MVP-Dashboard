import React from "react";
import { useNavigate } from "react-router-dom";
import KpiCard from "../components/dashboard/KpiCard.jsx";
import OperationalHealth from "../components/dashboard/OperationalHealth.jsx";
import RecruitmentFunnelWidget from "../components/dashboard/RecruitmentFunnelWidget.jsx";
import WorkloadOverview from "../components/dashboard/WorkloadOverview.jsx";
import ProjectMiniList from "../components/dashboard/ProjectMiniList.jsx";
import ActivityFeed from "../components/dashboard/ActivityFeed.jsx";
import AlertsPanel from "../components/dashboard/AlertsPanel.jsx";
import Icon from "../components/ui/Icon.jsx";
import { employees } from "../data/employees.js";
import { candidates } from "../data/candidates.js";
import { projects } from "../data/projects.js";
import { tasks, getOverdueTasks } from "../data/tasks.js";
import { alerts } from "../data/alerts.js";

export default function Dashboard() {
    const navigate = useNavigate();

    const activeEmployees = employees.filter((e) => e.status === "Active").length;
    const activeRecruitment = candidates.filter((c) => !["hired", "rejected"].includes(c.stageKey)).length;
    const activeProjects = projects.filter((p) => p.status !== "Completed").length;
    const openTasks = tasks.filter((t) => t.status !== "Done").length;
    const overdueTasks = getOverdueTasks().length;
    const criticalAlerts = alerts.filter((a) => a.severity === "بالا").length;

    const now = new Date();
    const dateStr = now.toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>داشبورد عملیات پرسنل و پروژه‌ها</h1>
                    <p className="page-subtitle">{dateStr} · نمای کلی وضعیت سازمان در یک نگاه</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="dashboard-top-grid">
                <OperationalHealth score={86} />
                <div className="card card-pad">
                    <div className="section-title">خلاصه وضعیت کارکنان</div>
                    <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                        <MiniStat label="کارکنان فعال" value={activeEmployees} note="+3 این ماه" tone="up" onClick={() => navigate("/employees")} />
                        <MiniStat
                            label="نیروهای جدید"
                            value={employees.filter((e) => e.status === "Onboarding").length + 2}
                            note="در 30 روز اخیر"
                            tone="up"
                            onClick={() => navigate("/employees?status=Onboarding")}
                        />
                        <MiniStat
                            label="در حال آنبوردینگ"
                            value={employees.filter((e) => e.status === "Onboarding").length}
                            note="نیازمند پیگیری"
                            tone="flat"
                            onClick={() => navigate("/employees?status=Onboarding")}
                        />
                        <MiniStat
                            label="بدون تخصیص"
                            value={employees.filter((e) => e.status === "Available").length}
                            note="آماده تخصیص پروژه"
                            tone="flat"
                            onClick={() => navigate("/employees?status=Available")}
                        />
                    </div>
                </div>
            </div>

            <div className="kpi-grid">
                <KpiCard icon="👥" label="کارکنان فعال" value={activeEmployees} trend="+3" trendTone="up" note="نسبت به ماه گذشته" onClick={() => navigate("/employees")} />
                <KpiCard icon="🧩" label="فرآیندهای استخدامی باز" value={activeRecruitment} trend="+2" trendTone="up" note="در جریان بررسی" onClick={() => navigate("/recruitment")} />
                <KpiCard icon="📁" label="پروژه‌های فعال" value={activeProjects} note="از 6 پروژه کل" onClick={() => navigate("/projects")} />
                <KpiCard icon="🗂️" label="Taskهای باز" value={openTasks} note={`از ${tasks.length} Task کل`} onClick={() => navigate("/projects")} />
                <KpiCard icon="⏰" label="Taskهای دارای تاخیر" value={overdueTasks} trend={overdueTasks > 0 ? "نیازمند توجه" : "پاک"} trendTone={overdueTasks > 0 ? "down" : "up"} onClick={() => navigate("/alerts")} />
                <KpiCard icon="🚨" label="هشدارهای مهم" value={criticalAlerts} trend="بالا" trendTone="down" note="نیازمند بررسی فوری" onClick={() => navigate("/alerts")} />
            </div>

            <section className="executive-focus card card-pad" aria-label="اولویت‌های مدیریتی">
                <div className="card-title-row">
                    <div>
                        <h3>تمرکز مدیریتی</h3>
                        <p className="muted executive-focus-subtitle">سه نقطه ورود برای تصمیم‌گیری سریع و drill-down</p>
                    </div>
                    <span className="proto-badge">به‌روزرسانی زنده</span>
                </div>
                <div className="executive-focus-grid">
                    <ExecutiveFocus
                        icon="alert"
                        tone="danger"
                        label="نیازمند توجه فوری"
                        value={`${overdueTasks} تسک دارای تأخیر`}
                        detail={`${criticalAlerts} هشدار با اولویت بالا`}
                        onClick={() => navigate("/alerts")}
                    />
                    <ExecutiveFocus
                        icon="folder"
                        tone="info"
                        label="ظرفیت و منابع"
                        value={`${employees.filter((e) => e.status === "Available").length} نفر آماده تخصیص`}
                        detail={`${activeProjects} پروژه فعال`}
                        onClick={() => navigate("/projects")}
                    />
                    <ExecutiveFocus
                        icon="users"
                        tone="success"
                        label="چرخه نیروی انسانی"
                        value={`${activeRecruitment} فرآیند استخدامی`}
                        detail={`${employees.filter((e) => e.status === "Onboarding").length} نفر در آنبوردینگ`}
                        onClick={() => navigate("/recruitment")}
                    />
                </div>
            </section>

            <div className="dashboard-mid-grid">
                <RecruitmentFunnelWidget />
                <WorkloadOverview />
            </div>

            <div className="dashboard-bottom-grid">
                <ProjectMiniList />
                <AlertsPanel limit={4} />
            </div>

            <div style={{ marginTop: 16 }}>
                <ActivityFeed limit={6} />
            </div>
        </div>
    );
}

function MiniStat({ label, value, note, tone, onClick }) {
    const toneClass = tone === "up" ? "kpi-trend-up" : tone === "down" ? "kpi-trend-down" : "kpi-trend-flat";
    return (
        <button className="mini-stat-button" onClick={onClick}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy-900)" }}>{value}</div>
            <div className="muted" style={{ fontSize: 12 }}>{label}</div>
            <div className={toneClass} style={{ fontSize: 11, marginTop: 2 }}>{note}</div>
        </button>
    );
}

function ExecutiveFocus({ icon, tone, label, value, detail, onClick }) {
    return (
        <button className={`executive-focus-item executive-focus-${tone}`} onClick={onClick}>
            <span className="executive-focus-icon"><Icon name={icon} size={18} /></span>
            <span className="executive-focus-copy">
                <strong>{label}</strong>
                <span>{value}</span>
                <small>{detail}</small>
            </span>
            <Icon name="chevronLeft" size={16} />
        </button>
    );
}
