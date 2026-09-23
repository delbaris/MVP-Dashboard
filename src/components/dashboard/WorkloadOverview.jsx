import React from "react";
import { useNavigate } from "react-router-dom";
import { teams } from "../../data/teams.js";
import { employees } from "../../data/employees.js";
import { tasks } from "../../data/tasks.js";

function computeAssigned(teamId) {
    const teamEmployeeIds = employees.filter((e) => e.teamId === teamId).map((e) => e.id);
    const activeTasks = tasks.filter((t) => teamEmployeeIds.includes(t.assigneeId) && t.status !== "Done");
    // هر Task باز تقریبا 4 واحد بار کاری فرض می‌شود (Demo)
    return activeTasks.length * 4;
}

export default function WorkloadOverview() {
    const navigate = useNavigate();

    return (
        <div className="card card-pad">
            <div className="card-title-row">
                <h3>بار کاری تیم‌ها</h3>
                <span className="link-more" onClick={() => navigate("/employees")}>مشاهده کارکنان ←</span>
            </div>
            <div className="workload-list">
                {teams.map((team) => {
                    const assigned = computeAssigned(team.id);
                    const pct = Math.min(100, Math.round((assigned / team.capacity) * 100));
                    const overloaded = pct >= 90;
                    const barColor = overloaded ? "#b23b3b" : pct >= 70 ? "#b8860b" : "#1f8a5f";
                    return (
                        <div
                            key={team.id}
                            className="workload-row"
                            onClick={() => navigate(`/employees?team=${team.id}`)}
                            title="مشاهده اعضای تیم"
                        >
                            <div className="workload-row-top">
                                <span style={{ fontWeight: 600 }}>{team.nameFa}</span>
                                <span className={overloaded ? "kpi-trend-down" : "faint"}>
                                    {assigned}/{team.capacity} {overloaded ? "· Overloaded" : ""}
                                </span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
