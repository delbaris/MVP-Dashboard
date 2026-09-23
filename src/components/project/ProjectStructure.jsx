import React, { useMemo, useState } from "react";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import { toPersianDigits } from "../../utils/jalali.js";

export default function ProjectStructure({ manager, members, tasks }) {
    const [expanded, setExpanded] = useState({});
    const directReports = members.filter((member) => member.managerId === manager?.id);
    const topLevelMembers = directReports.length ? directReports : members;

    function toggle(id) {
        setExpanded((current) => ({ ...current, [id]: current[id] === false ? true : false }));
    }

    function taskItems(employeeId) {
        return tasks.filter((task) => task.assigneeId === employeeId);
    }

    function PersonNode({ employee, level = 0 }) {
        const employeeTasks = taskItems(employee.id);
        const isExpanded = expanded[employee.id] !== false;
        const reports = members.filter((member) => member.managerId === employee.id);
        return (
            <div className={`project-tree-branch project-tree-level-${Math.min(level, 2)}`}>
                <div className="project-tree-person">
                    <Avatar name={employee.name} color={employee.avatarColor} size="sm" />
                    <div className="project-tree-person-copy">
                        <strong>{employee.name}</strong>
                        <span>{employee.title || employee.role}</span>
                    </div>
                    <span className="project-tree-task-count">{toPersianDigits(employeeTasks.length)} Task</span>
                    {(reports.length || employeeTasks.length) > 0 && (
                        <button className="project-tree-toggle" type="button" onClick={() => toggle(employee.id)} aria-label={isExpanded ? "جمع کردن گره" : "باز کردن گره"}>
                            {isExpanded ? "−" : "+"}
                        </button>
                    )}
                </div>
                {isExpanded && (
                    <div className="project-tree-children">
                        {reports.map((report) => <PersonNode key={report.id} employee={report} level={level + 1} />)}
                        {employeeTasks.map((task) => (
                            <div className="project-tree-task" key={task.id}>
                                <span className="project-tree-task-dot" />
                                <span>{task.title}</span>
                                <Badge>{task.status === "Done" ? "تکمیل" : task.status === "Blocked" ? "مسدود" : "باز"}</Badge>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="project-structure">
            <div className="project-tree-legend">ساختار مسئولیت و Taskها · برای باز و بسته‌کردن هر گره روی علامت آن کلیک کنید.</div>
            <div className="project-tree">
                {manager ? <PersonNode employee={manager} /> : <div className="muted">مدیر پروژه ثبت نشده است.</div>}
                {topLevelMembers.map((member) => <PersonNode key={member.id} employee={member} level={1} />)}
            </div>
            <div className="project-structure-summary">
                <div><strong>{toPersianDigits(members.length + (manager ? 1 : 0))}</strong><span>نفر در ساختار پروژه</span></div>
                <div><strong>{toPersianDigits(tasks.length)}</strong><span>Task مرتبط</span></div>
                <div><strong>{toPersianDigits(directReports.length)}</strong><span>سرپرست مستقیم</span></div>
            </div>
        </div>
    );
}
