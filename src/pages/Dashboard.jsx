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
import { useData } from "../context/DataContext.jsx";
import { alerts } from "../data/alerts.js";
import { formatDemoMoney, getProjectFinancials } from "../utils/projectFinancials.js";
import { toPersianDigits } from "../utils/jalali.js";

export default function Dashboard() {
    const navigate = useNavigate();
    const { employees: employeeRecords, candidates: candidateRecords, projects: projectRecords, tasks: taskRecords } = useData();

    const activeEmployees = employeeRecords.filter((e) => e.status === "Active").length;
    const activeRecruitment = candidateRecords.filter((c) => !["hired", "rejected"].includes(c.stageKey)).length;
    const activeProjects = projectRecords.filter((p) => p.status !== "Completed").length;
    const openTasks = taskRecords.filter((t) => t.status !== "Done").length;
    const overdueTasks = taskRecords.filter((t) => t.status !== "Done" && t.dueDate < "1403-06-16").length;
    const criticalAlerts = alerts.filter((a) => a.severity === "بالا").length;
    const riskProjects = projectRecords.filter((project) => ["At Risk", "Delayed"].includes(project.status)).sort((a, b) => a.health - b.health);
    const highPriorityOpenTasks = taskRecords.filter((task) => task.priority === "بالا" && task.status !== "Done").length;
    const financialSummary = projectRecords.reduce((summary, project) => {
        const financials = getProjectFinancials(project);
        return {
            planned: summary.planned + financials.plannedBudget,
            actual: summary.actual + financials.actualCost,
            remaining: summary.remaining + financials.remainingBudget,
        };
    }, { planned: 0, actual: 0, remaining: 0 });

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
                            value={employeeRecords.filter((e) => e.status === "Onboarding").length + 2}
                            note="در 30 روز اخیر"
                            tone="up"
                            onClick={() => navigate("/employees?status=Onboarding")}
                        />
                        <MiniStat
                            label="در حال آنبوردینگ"
                            value={employeeRecords.filter((e) => e.status === "Onboarding").length}
                            note="نیازمند پیگیری"
                            tone="flat"
                            onClick={() => navigate("/employees?status=Onboarding")}
                        />
                        <MiniStat
                            label="بدون تخصیص"
                            value={employeeRecords.filter((e) => e.status === "Available").length}
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
                <KpiCard icon="🗂️" label="کارهای باز" value={openTasks} note={`از ${taskRecords.length} کار کل`} onClick={() => navigate("/projects")} />
                <KpiCard icon="⏰" label="Taskهای دارای تاخیر" value={overdueTasks} trend={overdueTasks > 0 ? "نیازمند توجه" : "پاک"} trendTone={overdueTasks > 0 ? "down" : "up"} onClick={() => navigate("/alerts")} />
                <KpiCard icon="🚨" label="هشدارهای مهم" value={criticalAlerts} trend="بالا" trendTone="down" note="نیازمند بررسی فوری" onClick={() => navigate("/alerts")} />
            </div>

            <section className="executive-focus card card-pad" aria-label="اولویت‌های مدیریتی">
                <div className="card-title-row">
                    <div>
                        <h3>تمرکز مدیریتی</h3>
                        <p className="muted executive-focus-subtitle">اولویت‌ها بر اساس ریسک، ظرفیت و وضعیت داده‌های عملیاتی مرتب شده‌اند.</p>
                    </div>
                    <span className="proto-badge">داده نمونه · آماده اتصال به API</span>
                </div>
                <div className="executive-focus-grid">
                    <ExecutiveFocus
                        icon="alert"
                        tone="danger"
                        label="ریسک پروژه و زمان"
                        value={`${riskProjects.length} پروژه پرریسک`}
                        detail={`${overdueTasks} تأخیر · ${highPriorityOpenTasks} Task مهم باز`}
                        onClick={() => navigate("/alerts")}
                    />
                    <ExecutiveFocus
                        icon="folder"
                        tone="info"
                        label="ظرفیت و منابع"
                        value={`${employeeRecords.filter((e) => e.status === "Available").length} نفر آماده تخصیص`}
                        detail={`${activeProjects} پروژه فعال`}
                        onClick={() => navigate("/projects")}
                    />
                    <ExecutiveFocus
                        icon="users"
                        tone="success"
                        label="چرخه نیروی انسانی"
                        value={`${activeRecruitment} فرآیند استخدامی`}
                        detail={`${employeeRecords.filter((e) => e.status === "Onboarding").length} نفر در آنبوردینگ`}
                        onClick={() => navigate("/recruitment")}
                    />
                    <ExecutiveFocus
                        icon="chart"
                        tone="neutral"
                        label="بودجه و هزینه"
                        value={`${formatDemoMoney(financialSummary.actual)} مصرف‌شده`}
                        detail={`${formatDemoMoney(financialSummary.remaining)} مانده · ${toPersianDigits(projectRecords.length)} پروژه`}
                        onClick={() => navigate("/analytics")}
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
