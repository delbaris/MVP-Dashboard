import React from "react";
import { useNavigate } from "react-router-dom";
import { recruitmentFunnel } from "../../data/candidates.js";

export default function RecruitmentFunnelWidget() {
    const navigate = useNavigate();
    const max = recruitmentFunnel[0].count;

    return (
        <div className="card card-pad">
            <div className="card-title-row">
                <h3>قیف جذب و استخدام</h3>
                <span className="link-more" onClick={() => navigate("/recruitment")}>مشاهده کامل ←</span>
            </div>
            <div className="funnel">
                {recruitmentFunnel.map((stage, idx) => {
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
