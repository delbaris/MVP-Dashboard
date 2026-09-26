import React, { useMemo, useState } from "react";
import { formatJalali, gregorianToJalali, jalaliToGregorian, toPersianDigits } from "../../utils/jalali.js";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getTimestamp(value) {
    if (!DATE_PATTERN.test(value || "")) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const gregorian = jalaliToGregorian(year, month, day);
    const roundTrip = gregorianToJalali(gregorian.year, gregorian.month, gregorian.day);
    if (roundTrip.year !== year || roundTrip.month !== month || roundTrip.day !== day) return null;
    return Date.UTC(gregorian.year, gregorian.month - 1, gregorian.day);
}

function getStatusColor(status) {
    if (status === "Done") return "var(--color-success)";
    if (status === "Blocked" || status === "Delayed") return "var(--color-danger)";
    if (status === "Review" || status === "Pending") return "var(--color-warning)";
    if (status === "In Progress") return "var(--color-info)";
    return "var(--color-text-faint)";
}

function formatAxisDate(timestamp) {
    const date = new Date(timestamp);
    const jalali = gregorianToJalali(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    return toPersianDigits(`${jalali.month}/${jalali.day}`);
}

export default function ProjectGantt({ project, tasks, employees, onOpenTasks, onOpenMilestones }) {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const timeline = useMemo(() => {
        const items = [
            ...tasks.map((task) => ({
                id: task.id,
                title: task.title,
                kind: "task",
                status: task.status,
                progress: Number(task.progress || 0),
                startDate: DATE_PATTERN.test(task.createdAt || "") ? task.createdAt : project.startDate,
                endDate: task.dueDate || project.deadline,
                assignee: employees.find((employee) => employee.id === task.assigneeId)?.name || "مسئول تعیین نشده",
            })),
            ...(project.milestones || []).map((milestone, index) => ({
                id: `milestone-${index}`,
                title: milestone.title,
                kind: "milestone",
                status: milestone.status,
                progress: milestone.status === "Done" ? 100 : 0,
                startDate: milestone.date,
                endDate: milestone.date,
                assignee: null,
            })),
        ].map((item) => ({
            ...item,
            start: getTimestamp(item.startDate),
            end: getTimestamp(item.endDate),
        })).filter((item) => item.start !== null && item.end !== null);

        if (!items.length) return { items, start: null, end: null, ticks: [] };
        const first = Math.min(...items.map((item) => Math.min(item.start, item.end)));
        const last = Math.max(...items.map((item) => Math.max(item.start, item.end)));
        const padding = Math.max(86400000, Math.ceil((last - first) * 0.04));
        const start = first - padding;
        const end = Math.max(last + padding, start + 86400000);
        const ticks = Array.from({ length: 5 }, (_, index) => start + ((end - start) * index) / 4);
        return { items, start, end, ticks };
    }, [employees, project, tasks]);

    const selectedItem = timeline.items.find((item) => item.id === selectedItemId);
    const duration = timeline.start === null || timeline.end === null ? 1 : timeline.end - timeline.start;

    return (
        <section className="project-gantt card card-pad" aria-labelledby="project-gantt-title">
            <div className="card-title-row">
                <div>
                    <h2 id="project-gantt-title">نمودار زمان‌بندی پروژه</h2>
                    <p className="muted project-gantt-subtitle">برای دیدن جزئیات هر Task یا Milestone انتخاب کنید.</p>
                </div>
                <span className="proto-badge">داده نمایشی</span>
            </div>

            {timeline.items.length === 0 ? (
                <p className="muted" role="status">برای نمایش نمودار، تاریخ معتبر Jalali برای Task یا Milestone لازم است.</p>
            ) : (
                <div className="project-gantt-scroll" role="region" aria-label="نمودار زمان‌بندی؛ برای دیدن ادامه بازه افقی پیمایش کنید" tabIndex={0}>
                    <div className="project-gantt-chart" dir="rtl">
                        <div className="project-gantt-axis">
                            <span className="project-gantt-axis-label">فعالیت / بازه</span>
                            <div className="project-gantt-axis-track" dir="ltr">
                                {timeline.ticks.map((tick, index) => (
                                    <span key={index} style={{ left: `${(index / 4) * 100}%` }}>{formatAxisDate(tick)}</span>
                                ))}
                            </div>
                        </div>
                        {timeline.items.map((item) => {
                            const start = Math.min(item.start, item.end);
                            const end = Math.max(item.start, item.end);
                            const left = ((start - timeline.start) / duration) * 100;
                            const width = item.kind === "milestone" ? 0 : Math.max(((end - start) / duration) * 100, 1.5);
                            const color = getStatusColor(item.status);
                            return (
                                <button
                                    className={`project-gantt-row ${selectedItemId === item.id ? "project-gantt-row-selected" : ""}`}
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedItemId(item.id)}
                                    aria-pressed={selectedItemId === item.id}
                                    aria-label={`${item.kind === "task" ? "Task" : "Milestone"}: ${item.title}، ${formatJalali(item.startDate)} تا ${formatJalali(item.endDate)}، وضعیت ${item.status}`}
                                >
                                    <span className="project-gantt-item-label">
                                        <span className="project-gantt-item-kind">{item.kind === "task" ? "Task" : "Milestone"}</span>
                                        <strong>{item.title}</strong>
                                    </span>
                                    <span className="project-gantt-track" dir="ltr">
                                        <span
                                            className={`project-gantt-bar ${item.kind === "milestone" ? "project-gantt-milestone" : ""}`}
                                            style={{ left: `${left}%`, width: item.kind === "milestone" ? 12 : `${width}%`, backgroundColor: color }}
                                        >
                                            {item.kind === "task" && <span style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%` }} />}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedItem && (
                <div className="project-gantt-detail" aria-live="polite">
                    <div>
                        <span className="project-gantt-item-kind">{selectedItem.kind === "task" ? "Task انتخاب‌شده" : "Milestone انتخاب‌شده"}</span>
                        <strong>{selectedItem.title}</strong>
                        <span className="muted">
                            {formatJalali(selectedItem.startDate)} تا {formatJalali(selectedItem.endDate)}
                            {selectedItem.assignee ? ` · مسئول: ${selectedItem.assignee}` : ""}
                            {selectedItem.kind === "task" ? ` · پیشرفت: ${toPersianDigits(selectedItem.progress)}٪` : ""}
                            {` · وضعیت: ${selectedItem.status}`}
                        </span>
                    </div>
                    <button
                        className="btn btn-sm btn-secondary"
                        type="button"
                        onClick={selectedItem.kind === "task" ? onOpenTasks : onOpenMilestones}
                    >
                        مشاهده جزئیات
                    </button>
                </div>
            )}
        </section>
    );
}
