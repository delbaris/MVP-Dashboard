import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../ui/Badge.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import { projectStatusMap } from "../../utils/statusMaps.js";
import { useData } from "../../context/DataContext.jsx";

export default function ProjectMiniList() {
    const navigate = useNavigate();
    const { projects, employees } = useData();
    const sorted = [...projects].sort((a, b) => a.health - b.health).slice(0, 5);

    return (
        <div className="card card-pad">
            <div className="card-title-row">
                <h3>وضعیت پروژه‌های کلیدی</h3>
                <span className="link-more" onClick={() => navigate("/projects")}>مشاهده همه ←</span>
            </div>
            <div className="vstack" style={{ gap: 12 }}>
                {sorted.map((p) => {
                    const manager = employees.find((employee) => employee.id === p.managerId);
                    const st = projectStatusMap[p.status];
                    return (
                        <div key={p.id} className="mini-project-row" onClick={() => navigate(`/projects/${p.id}`)}>
                            <div className="mini-project-top">
                                <span style={{ fontWeight: 700 }}>{p.name}</span>
                                <Badge className={st.badge}>{st.label}</Badge>
                            </div>
                            <div className="faint" style={{ marginBottom: 6, fontSize: 12 }}>
                                {p.client} · مدیر پروژه: {manager?.name}
                            </div>
                            <ProgressBar value={p.progress} />
                            <div className="hstack" style={{ justifyContent: "space-between", marginTop: 6 }}>
                                <span className="faint" style={{ fontSize: 11.5 }}>پیشرفت {p.progress}٪</span>
                                <span className="faint" style={{ fontSize: 11.5 }}>مهلت: {p.deadline}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
