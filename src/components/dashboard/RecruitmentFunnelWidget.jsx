import React from "react";
import { useNavigate } from "react-router-dom";
import { recruitmentFunnel } from "../../data/candidates.js";
import { useData } from "../../context/DataContext.jsx";

export default function RecruitmentFunnelWidget() {
    const navigate = useNavigate();
    const { candidates } = useData();
    const stages = recruitmentFunnel.map((stage) => ({
        ...stage,
        count: candidates.filter((candidate) => candidate.stageKey === stage.key).length,
    }));
    const max = Math.max(...stages.map((stage) => stage.count), 1);

    return (
        <div className="card card-pad">
            <div className="card-title-row">
                <h3>قیف جذب و استخدام</h3>
                <span className="link-more" onClick={() => navigate("/recruitment")}>مشاهده کامل ←</span>
            </div>
            <div className="funnel">
                {stages.map((stage) => {
                    const widthPct = 40 + (stage.count / max) * 60;
                    return (
                        <div
                            key={stage.key}
                            className="funnel-row"
                            onClick={() => navigate(`/recruitment?stage=${stage.key}`)}
                            title="مشاهده کاندیداهای این مرحله"
                        >
                            <div className="funnel-bar-wrap">
                                <div className="funnel-bar" style={{ width: `${widthPct}%` }}>
                                    <span className="funnel-count">{stage.count}</span>
                                </div>
                            </div>
                            <div className="funnel-label">{stage.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
