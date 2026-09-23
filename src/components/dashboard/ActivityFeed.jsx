import React from "react";
import { useNavigate } from "react-router-dom";
import { activities } from "../../data/activities.js";
import { getEmployeeById } from "../../data/employees.js";
import Avatar from "../ui/Avatar.jsx";

export default function ActivityFeed({ limit = 6 }) {
    const navigate = useNavigate();
    const recent = activities.slice(0, limit);

    return (
        <div className="card card-pad">
            <div className="card-title-row">
                <h3>فعالیت‌های اخیر</h3>
                <span className="link-more" onClick={() => navigate("/activities")}>مشاهده همه ←</span>
            </div>
            <div className="timeline">
                {recent.map((act) => {
                    const emp = getEmployeeById(act.employeeId);
                    return (
                        <div key={act.id} className="timeline-item" onClick={() => emp && navigate(`/employees/${emp.id}`)}>
                            <div className="timeline-time">{act.time}</div>
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                                <div className="hstack" style={{ marginBottom: 3 }}>
                                    <Avatar name={emp?.name} color={emp?.avatarColor} size="sm" />
                                    <span style={{ fontWeight: 600 }}>{emp?.name}</span>
                                    <span className="tag">{act.type}</span>
                                </div>
                                <div className="muted" style={{ fontSize: 12.5 }}>{act.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
