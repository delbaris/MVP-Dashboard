import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const DEMO_REVENUE_BY_PROJECT = {
    "proj-01": 1400000000,
    "proj-02": 1100000000,
    "proj-03": 600000000,
    "proj-04": 1200000000,
    "proj-05": 550000000,
    "proj-06": 550000000,
};

const DEMO_MEETINGS = [
    { title: "جلسه هفتگی مدیران", daysAhead: 1, time: "۱۰:۰۰" },
    { title: "جلسه هماهنگی تیم پروژه", daysAhead: 2, time: "۱۴:۳۰" },
];

function formatMeetingDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long", month: "long", day: "numeric" }).format(date);
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [expandedKpi, setExpandedKpi] = useState(null);
    const { employees, candidates, projects, tasks } = useData();

    const activeEmployees = employees.filter((employee) => employee.status === "Active").length;
    const activeRecruitment = candidates.filter((candidate) => !["hired", "rejected"].includes(candidate.stageKey)).length;
    const activeProjects = projects.filter((project) => project.status !== "Completed");
    const executiveIssues = alerts.filter((alert) => alert.severity === "بالا");
    const demoGrossRevenue = projects.reduce((total, project) => total + (DEMO_REVENUE_BY_PROJECT[project.id] || 0), 0);
    const financialSummary = projects.reduce((summary, project) => {
        const financials = getProjectFinancials(project);
        return {
            budget: summary.budget + financials.plannedBudget,
            actual: summary.actual + financials.actualCost,
        };
    }, { budget: 0, actual: 0 });
    const openTasks = tasks.filter((task) => task.status !== "Done").length;
    const overdueTasks = tasks.filter((task) => task.status !== "Done" && task.dueDate < "1403-06-16").length;
    const riskProjects = projects.filter((project) => ["At Risk", "Delayed"].includes(project.status));
    const hiringByStage = candidates.reduce((counts, candidate) => {
        counts[candidate.stage] = (counts[candidate.stage] || 0) + 1;
        return counts;
    }, {});

    const dateLabel = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    }).format(new Date());

    const kpis = [
        {
            id: "finance",
            icon: "◈",
            label: "بودجه کل و هزینه کل",
            value: (
                <span className="executive-kpi-finance">
                    <span><small>بودجه</small><strong>{formatDemoMoney(financialSummary.budget)}</strong></span>
                    <span><small>هزینه</small><strong>{formatDemoMoney(financialSummary.actual)}</strong></span>
                </span>
            ),
            note: "برآوردهای نمایشی پروژه‌ها",
        },
        {
            id: "revenue",
            icon: "↗",
            label: "درآمد ناخالص کل",
            value: formatDemoMoney(demoGrossRevenue),
            note: "عدد فرضی دمو؛ تعریف مالی تأیید نشده",
        },
        {
            id: "projects",
            icon: "▣",
            label: "پروژه‌های فعال",
            value: toPersianDigits(activeProjects.length),
            note: "برای مشاهده فهرست پروژه‌ها انتخاب کنید",
        },
        {
            id: "issues",
            icon: "!",
            label: "موارد نیازمند پیگیری مدیران",
            value: toPersianDigits(executiveIssues.length),
            note: "هشدارهای سطح بالای نمونه",
        },
        {
            id: "meetings",
            icon: "◷",
            label: "جلسات پیش‌رو",
            value: toPersianDigits(DEMO_MEETINGS.length),
            note: "برنامه زمان‌بندی نمایشی",
        },
        {
            id: "employees",
            icon: "♙",
            label: "کارکنان فعال",
            value: toPersianDigits(activeEmployees),
            note: "از اطلاعات کارکنان نمونه",
        },
        {
            id: "recruitment",
            icon: "◎",
            label: "فرآیندهای جذب و استخدام",
            value: toPersianDigits(activeRecruitment),
            note: "کاندیداهای در جریان بررسی",
        },
    ];

    const toggleKpi = (id) => setExpandedKpi((current) => current === id ? null : id);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>نمای مدیریتی</h1>
                    <p className="page-subtitle">{dateLabel} · شاخص‌های کلیدی به ترتیب اولویت مدیران</p>
                </div>
                <span className="proto-badge">🧪 داده‌های نمونه و نمایشی</span>
            </div>

            <section className="executive-dashboard" aria-label="شاخص‌های اصلی مدیران">
                <div className="executive-kpi-list">
                    {kpis.map((kpi, index) => (
                        <button
                            className={`executive-kpi-card ${expandedKpi === kpi.id ? "executive-kpi-card-open" : ""}`}
                            key={kpi.id}
                            type="button"
                            onClick={() => toggleKpi(kpi.id)}
                            aria-expanded={expandedKpi === kpi.id}
                            aria-controls="executive-kpi-drilldown"
                        >
                            <span className="executive-kpi-icon" aria-hidden="true">{kpi.icon}</span>
                            <span className="executive-kpi-copy">
                                <span className="executive-kpi-label"><span>{toPersianDigits(index + 1)}.</span> {kpi.label}</span>
                                <span className="executive-kpi-value">{kpi.value}</span>
                                <span className="executive-kpi-note">{kpi.note}</span>
                            </span>
                            <Icon name="chevronLeft" size={18} />
                        </button>
                    ))}
                </div>
                {expandedKpi && (
                    <div className="executive-kpi-drilldown card card-pad" id="executive-kpi-drilldown" aria-live="polite">
                        <KpiDrilldown
                            id={expandedKpi}
                            activeProjects={activeProjects}
                            projects={projects}
                            executiveIssues={executiveIssues}
                            employees={employees}
                            hiringByStage={hiringByStage}
                            navigate={navigate}
                        />
                    </div>
                )}
            </section>

            <details className="secondary-dashboard">
                <summary>تحلیل‌های تکمیلی و نمودارهای مدیریتی</summary>
                <div className="dashboard-top-grid">
                    <OperationalHealth score={86} />
                    <div className="card card-pad">
                        <div className="section-title">خلاصه وضعیت کارکنان</div>
                        <div className="grid dashboard-mini-stats">
                            <MiniStat label="کارکنان فعال" value={activeEmployees} note="داده نمونه" onClick={() => navigate("/employees")} />
                            <MiniStat label="نیروهای جدید" value={employees.filter((employee) => employee.status === "Onboarding").length} note="در آنبوردینگ" onClick={() => navigate("/employees?status=Onboarding")} />
                            <MiniStat label="بدون تخصیص" value={employees.filter((employee) => employee.status === "Available").length} note="آماده تخصیص" onClick={() => navigate("/employees?status=Available")} />
                            <MiniStat label="کارهای باز" value={openTasks} note={`${tasks.length} Task نمونه`} onClick={() => navigate("/projects")} />
                        </div>
                    </div>
                </div>

                <section className="executive-focus card card-pad" aria-label="اولویت‌های مدیریتی">
                    <div className="card-title-row">
                        <div>
                            <h2>تمرکز مدیریتی</h2>
                            <p className="muted executive-focus-subtitle">ریسک، ظرفیت و منابع؛ تمام مقادیر این نسخه نمونه هستند.</p>
                        </div>
                        <span className="proto-badge">داده نمایشی</span>
                    </div>
                    <div className="executive-focus-grid">
                        <ExecutiveFocus icon="alert" tone="danger" label="ریسک پروژه و زمان" value={`${riskProjects.length} پروژه پرریسک`} detail={`${overdueTasks} مورد تأخیر`} onClick={() => navigate("/alerts")} />
                        <ExecutiveFocus icon="folder" tone="info" label="ظرفیت و منابع" value={`${employees.filter((employee) => employee.status === "Available").length} نفر آماده تخصیص`} detail={`${activeProjects.length} پروژه فعال`} onClick={() => navigate("/projects")} />
                        <ExecutiveFocus icon="users" tone="success" label="چرخه نیروی انسانی" value={`${activeRecruitment} فرآیند استخدامی`} detail={`${employees.filter((employee) => employee.status === "Onboarding").length} نفر در آنبوردینگ`} onClick={() => navigate("/recruitment")} />
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
                <div style={{ marginTop: 16 }}><ActivityFeed limit={6} /></div>
            </details>
        </div>
    );
}

function KpiDrilldown({ id, activeProjects, projects, executiveIssues, employees, hiringByStage, navigate }) {
    if (id === "finance") {
        return (
            <div>
                <div className="card-title-row">
                    <h2>خلاصه بودجه پروژه‌ها</h2>
                    <button className="btn btn-sm btn-secondary" type="button" onClick={() => navigate("/analytics")}>گزارش بودجه و هزینه</button>
                </div>
                <p className="finance-report-disclaimer">مقادیر از داده‌های نمونه پروژه‌ها آمده‌اند و گزارش حسابداری نیستند.</p>
                <div className="executive-drilldown-list">
                    {projects.map((project) => {
                        const financials = getProjectFinancials(project);
                        return (
                            <button key={project.id} type="button" onClick={() => navigate(`/projects/${project.id}`)}>
                                <span><strong>{project.name}</strong><small>بودجه · {financials.source}</small></span>
                                <span><strong>{formatDemoMoney(financials.plannedBudget)}</strong><small>هزینه: {formatDemoMoney(financials.actualCost)}</small></span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
    if (id === "revenue") {
        return (
            <div>
                <h2>درآمد ناخالص — نمونهٔ رابط کاربری</h2>
                <p className="finance-report-disclaimer">
                    ارقام زیر کاملاً فرضی‌اند و به فاکتور، دریافت وجه، قرارداد یا درآمد شناسایی‌شده متصل نیستند. تعریف مالی درآمد هنوز تأیید نشده است.
                </p>
                <div className="executive-drilldown-list">
                    {projects.filter((project) => DEMO_REVENUE_BY_PROJECT[project.id]).map((project) => (
                        <button key={project.id} type="button" onClick={() => navigate(`/projects/${project.id}`)}>
                            <span><strong>{project.name}</strong><small>درآمد ناخالص فرضی دمو</small></span>
                            <strong>{formatDemoMoney(DEMO_REVENUE_BY_PROJECT[project.id])}</strong>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    if (id === "projects") {
        return (
            <div>
                <div className="card-title-row"><h2>پروژه‌های فعال نمونه</h2><button className="btn btn-sm btn-secondary" type="button" onClick={() => navigate("/projects")}>همه پروژه‌ها</button></div>
                <div className="executive-drilldown-list">
                    {activeProjects.map((project) => (
                        <button key={project.id} type="button" onClick={() => navigate(`/projects/${project.id}`)}>
                            <span><strong>{project.name}</strong><small>{project.client}</small></span><span>{toPersianDigits(project.progress)}٪ پیشرفت</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    if (id === "issues") {
        return (
            <div>
                <div className="card-title-row"><h2>موارد پیگیری نمونه</h2><button className="btn btn-sm btn-secondary" type="button" onClick={() => navigate("/alerts")}>همه هشدارها</button></div>
                <div className="executive-drilldown-list">
                    {executiveIssues.map((issue) => (
                        <button key={issue.id} type="button" onClick={() => navigate("/alerts")}>
                            <span><strong>{issue.title}</strong><small>{issue.description}</small></span><span className="kpi-trend-down">{issue.severity}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    if (id === "meetings") {
        return (
            <div>
                <h2>برنامه جلسات نمونه</h2>
                <p className="finance-report-disclaimer">جلسات زیر ساختگی هستند؛ تقویم یا برنامهٔ واقعی هنوز به سامانه متصل نیست.</p>
                <div className="executive-drilldown-list">
                    {DEMO_MEETINGS.map((meeting) => (
                        <div className="executive-drilldown-entry" key={meeting.title}>
                            <span><strong>{meeting.title}</strong><small>{formatMeetingDate(meeting.daysAhead)}</small></span>
                            <strong>{meeting.time}</strong>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    if (id === "employees") {
        return (
            <div>
                <div className="card-title-row"><h2>کارکنان فعال نمونه</h2><button className="btn btn-sm btn-secondary" type="button" onClick={() => navigate("/employees")}>فهرست کارکنان</button></div>
                <div className="executive-drilldown-list">
                    {employees.filter((employee) => employee.status === "Active").slice(0, 5).map((employee) => (
                        <button key={employee.id} type="button" onClick={() => navigate(`/employees/${employee.id}`)}>
                            <span><strong>{employee.name}</strong><small>{employee.title}</small></span><span>{employee.location}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className="card-title-row"><h2>وضعیت جذب نمونه</h2><button className="btn btn-sm btn-secondary" type="button" onClick={() => navigate("/recruitment")}>صفحه جذب و استخدام</button></div>
            <div className="executive-hiring-stages">
                {Object.entries(hiringByStage).map(([stage, count]) => (
                    <button key={stage} type="button" onClick={() => navigate("/recruitment")}>
                        <span>{stage}</span><strong>{toPersianDigits(count)}</strong>
                    </button>
                ))}
            </div>
        </div>
    );
}

function MiniStat({ label, value, note, onClick }) {
    return (
        <button className="mini-stat-button" onClick={onClick} type="button">
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-navy-900)" }}>{toPersianDigits(value)}</div>
            <div className="muted" style={{ fontSize: 12 }}>{label}</div>
            <div className="kpi-trend-flat" style={{ fontSize: 11, marginTop: 2 }}>{note}</div>
        </button>
    );
}

function ExecutiveFocus({ icon, tone, label, value, detail, onClick }) {
    return (
        <button className={`executive-focus-item executive-focus-${tone}`} onClick={onClick} type="button">
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
