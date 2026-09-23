import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, employees } from "../data/employees.js";
import { teams } from "../data/teams.js";
import { getTasksByEmployee } from "../data/tasks.js";
import { getActivitiesByEmployee } from "../data/activities.js";
import { projects } from "../data/projects.js";
import {
    journeyStages,
    journeyStagesFa,
    employeeJourneyIndex,
    performanceReviews,
    onboardingStatus,
} from "../data/journey.js";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { employeeStatusMap, taskStatusMap, priorityMap } from "../utils/statusMaps.js";

const TABS = [
    { key: "overview", label: "نمای کلی" },
    { key: "recruitment", label: "استخدام" },
    { key: "onboarding", label: "آنبوردینگ" },
    { key: "projects", label: "پروژه‌ها" },
    { key: "tasks", label: "Taskها" },
    { key: "activity", label: "فعالیت" },
    { key: "performance", label: "عملکرد" },
    { key: "skills", label: "مهارت‌ها" },
    { key: "timeline", label: "Timeline" },
];

export default function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState("overview");
    const employee = getEmployeeById(id);

    if (!employee) {
        return (
            <EmptyState
                icon="👤"
                title="کارمند یافت نشد"
                subtitle="این شناسه در Mock Data موجود نیست."
            />
        );
    }

    const team = teams.find((t) => t.id === employee.teamId);
    const manager = employees.find((m) => m.id === employee.managerId);
    const tasks = getTasksByEmployee(employee.id);
    const openTasks = tasks.filter((t) => t.status !== "Done");
    const activities = getActivitiesByEmployee(employee.id);
    const employeeProjects = projects.filter((p) => p.memberIds.includes(employee.id));
    const st = employeeStatusMap[employee.status];
    const journeyIdx = employeeJourneyIndex[employee.id] ?? 0;
    const reviews = performanceReviews[employee.id] || [];
    const onboarding = onboardingStatus[employee.id];

    return (
        <div>
            <div className="back-link" onClick={() => navigate("/employees")}>→ بازگشت به فهرست کارکنان</div>

            <div className="detail-header card card-pad">
                <Avatar name={employee.name} color={employee.avatarColor} size="lg" />
                <div className="detail-header-info">
                    <h1>{employee.name}</h1>
                    <div className="muted">{employee.role}</div>
                    <div className="detail-header-meta">
                        <span>تیم: {team?.nameFa}</span>
                        <span>مدیر مستقیم: {manager ? manager.name : "—"}</span>
                        <span>محل: {employee.location}</span>
                        <span>تاریخ استخدام: {employee.hireDate}</span>
                    </div>
                </div>
                <div className="detail-header-actions">
                    <Badge className={st.badge}>{st.label}</Badge>
                </div>
            </div>

            <div className="tabs-bar">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        className={`tab-btn ${tab === t.key ? "tab-active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "overview" && (
                <div className="vstack" style={{ gap: 16 }}>
                    <div className="card card-pad">
                        <div className="section-title">خلاصه وضعیت</div>
                        <div className="stat-mini-grid">
                            <div className="stat-mini">
                                <div className="stat-mini-value">{employeeProjects.length}</div>
                                <div className="stat-mini-label">پروژه فعال</div>
                            </div>
                            <div className="stat-mini">
                                <div className="stat-mini-value">{openTasks.length}</div>
                                <div className="stat-mini-label">Taskهای باز</div>
                            </div>
                            <div className="stat-mini">
                                <div className="stat-mini-value">{tasks.length}</div>
                                <div className="stat-mini-label">کل Taskها</div>
                            </div>
                            <div className="stat-mini">
                                <div className="stat-mini-value">{activities.length}</div>
                                <div className="stat-mini-label">فعالیت ثبت‌شده</div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-pad">
                        <div className="section-title">مسیر شغلی کارمند (Employee Journey)</div>
                        <div className="journey-track">
                            {journeyStages.map((stage, idx) => (
                                <React.Fragment key={stage}>
                                    <div className={`journey-step ${idx < journeyIdx ? "done" : ""} ${idx === journeyIdx ? "current" : ""}`}>
                                        <div className="journey-step-circle">{idx < journeyIdx ? "✓" : idx + 1}</div>
                                        <div className="journey-step-label">{journeyStagesFa[stage]}</div>
                                    </div>
                                    {idx < journeyStages.length - 1 && (
                                        <div className={`journey-connector ${idx < journeyIdx ? "done" : ""}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <p className="muted" style={{ fontSize: 12.5 }}>
                            وضعیت فعلی: <strong>{journeyStagesFa[journeyStages[journeyIdx]]}</strong>
                        </p>
                    </div>
                </div>
            )}

            {tab === "recruitment" && (
                <div className="card card-pad">
                    <div className="section-title">تاریخچه فرآیند جذب</div>
                    <p className="muted" style={{ fontSize: 13 }}>
                        {employee.name} از مسیر استخدامی سازمان عبور کرده و اکنون کارمند فعال است. جزئیات کامل مصاحبه‌ها در بخش «جذب و
                        استخدام» برای داوطلبان فعال موجود است.
                    </p>
                </div>
            )}

            {tab === "onboarding" && (
                <div className="card card-pad">
                    <div className="section-title">وضعیت آنبوردینگ</div>
                    {onboarding ? (
                        <>
                            <ProgressBar value={onboarding.completed} />
                            <p className="muted" style={{ fontSize: 12.5, margin: "8px 0 14px" }}>
                                {onboarding.completed}٪ تکمیل شده
                            </p>
                            <div className="section-title">موارد باقی‌مانده</div>
                            <ul style={{ paddingRight: 18, fontSize: 13, lineHeight: 1.9 }}>
                                {onboarding.pendingItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <EmptyState icon="✅" title="آنبوردینگ این کارمند تکمیل شده است" />
                    )}
                </div>
            )}

            {tab === "projects" && (
                <div className="card">
                    {employeeProjects.length === 0 ? (
                        <EmptyState icon="📁" title="این کارمند در حال حاضر روی پروژه‌ای تخصیص ندارد" />
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>پروژه</th>
                                        <th>مشتری</th>
                                        <th>پیشرفت</th>
                                        <th>وضعیت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeProjects.map((p) => (
                                        <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>
                                            <td style={{ fontWeight: 700 }}>{p.name}</td>
                                            <td>{p.client}</td>
                                            <td style={{ minWidth: 140 }}><ProgressBar value={p.progress} /></td>
                                            <td>{p.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {tab === "tasks" && (
                <div className="card">
                    {tasks.length === 0 ? (
                        <EmptyState icon="🗂️" title="Taskی برای این کارمند ثبت نشده است" />
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>عنوان Task</th>
                                        <th>پروژه</th>
                                        <th>اولویت</th>
                                        <th>وضعیت</th>
                                        <th>پیشرفت</th>
                                        <th>مهلت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((t) => {
                                        const proj = projects.find((p) => p.id === t.projectId);
                                        const ts = taskStatusMap[t.status];
                                        const pr = priorityMap[t.priority];
                                        return (
                                            <tr key={t.id} onClick={() => navigate(`/projects/${t.projectId}`)}>
                                                <td style={{ fontWeight: 600 }}>{t.title}</td>
                                                <td>{proj?.name}</td>
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
                        <EmptyState icon="🕒" title="فعالیتی ثبت نشده است" />
                    ) : (
                        <div className="timeline">
                            {activities.map((act) => (
                                <div key={act.id} className="timeline-item" style={{ cursor: "default" }}>
                                    <div className="timeline-time">{act.time}</div>
                                    <div className="timeline-dot" />
                                    <div className="timeline-content">
                                        <div className="hstack" style={{ marginBottom: 3 }}>
                                            <span className="tag">{act.type}</span>
                                            <span className="faint" style={{ fontSize: 11.5 }}>{act.date}</span>
                                        </div>
                                        <div className="muted" style={{ fontSize: 12.5 }}>{act.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === "performance" && (
                <div className="card card-pad">
                    <div className="section-title">Reviewهای عملکرد</div>
                    {reviews.length === 0 ? (
                        <EmptyState icon="📈" title="هنوز بازبینی عملکردی ثبت نشده است" />
                    ) : (
                        <div className="vstack" style={{ gap: 12 }}>
                            {reviews.map((r, i) => (
                                <div key={i} className="risk-row" style={{ alignItems: "center" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13 }}>{r.period}</div>
                                        <div className="muted" style={{ fontSize: 12.5 }}>{r.note}</div>
                                        <div className="faint" style={{ fontSize: 11.5, marginTop: 4 }}>بازبین: {r.reviewer}</div>
                                    </div>
                                    <div className="score-pill">{r.score}/100</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {tab === "skills" && (
                <div className="card card-pad">
                    <div className="section-title">مهارت‌ها</div>
                    <div className="hstack" style={{ flexWrap: "wrap", gap: 8 }}>
                        {employee.skills.map((s) => (
                            <span key={s} className="tag" style={{ fontSize: 12.5, padding: "6px 12px" }}>{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {tab === "timeline" && (
                <div className="card card-pad">
                    <div className="section-title">Timeline چرخه عمر کارمند</div>
                    <div className="vstack" style={{ gap: 10 }}>
                        {[
                            "رزومه دریافت شد",
                            "مصاحبه HR برگزار شد",
                            "مصاحبه فنی برگزار شد",
                            "پیشنهاد همکاری ارسال شد",
                            `استخدام در تاریخ ${employee.hireDate}`,
                            "فرآیند آنبوردینگ انجام شد",
                            `تخصیص به پروژه ${employeeProjects[0]?.name || "—"}`,
                            `${openTasks.length} Task جاری در حال انجام`,
                            reviews.length ? "بازبینی عملکرد ثبت شد" : "هنوز بازبینی عملکرد ثبت نشده",
                        ].map((step, i) => (
                            <div key={i} className="hstack" style={{ gap: 10 }}>
                                <span className="timeline-dot" style={{ margin: 0 }} />
                                <span style={{ fontSize: 13 }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
