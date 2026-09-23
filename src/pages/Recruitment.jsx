import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { candidates, recruitmentFunnel } from "../data/candidates.js";
import Drawer from "../components/ui/Drawer.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function Recruitment() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [activeCandidate, setActiveCandidate] = useState(null);
    const highlightStage = params.get("stage");

    const columns = useMemo(() => {
        return recruitmentFunnel
            .filter((s) => s.key !== "rejected")
            .concat([{ key: "rejected", label: "رد شده", count: 0 }])
            .map((stage) => ({
                ...stage,
                candidates: candidates.filter((c) => c.stageKey === stage.key),
            }));
    }, []);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>جذب و استخدام</h1>
                    <p className="page-subtitle">فضای کاری Pipeline استخدام - از دریافت رزومه تا استخدام نهایی</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="kanban-board">
                {columns.map((col) => (
                    <div
                        key={col.key}
                        className="kanban-col"
                        style={highlightStage === col.key ? { boxShadow: "0 0 0 2px var(--color-primary-light)" } : undefined}
                    >
                        <div className="kanban-col-header">
                            <span>{col.label}</span>
                            <span className="kanban-count">{col.candidates.length}</span>
                        </div>
                        {col.candidates.length === 0 && (
                            <div className="faint" style={{ fontSize: 12, padding: "10px 6px" }}>موردی نیست</div>
                        )}
                        {col.candidates.map((c) => (
                            <div key={c.id} className="candidate-card" onClick={() => setActiveCandidate(c)}>
                                <div className="candidate-card-name">{c.name}</div>
                                <div className="candidate-card-role">{c.appliedRole} · {c.experience}</div>
                                <div className="candidate-card-row">
                                    <span>مسئول: {c.owner}</span>
                                    <span className="score-pill">{c.score || "—"}</span>
                                </div>
                                <div className="candidate-card-row">
                                    <span>آخرین فعالیت</span>
                                    <span>{c.lastActivity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Drawer open={!!activeCandidate} onClose={() => setActiveCandidate(null)} title={activeCandidate?.name || ""}>
                {activeCandidate && (
                    <div className="vstack" style={{ gap: 16 }}>
                        <div>
                            <div className="section-title">اطلاعات کلی</div>
                            <p style={{ fontSize: 13 }}>
                                <strong>سمت درخواستی:</strong> {activeCandidate.appliedRole} · <strong>تجربه:</strong> {activeCandidate.experience}
                            </p>
                            <p style={{ fontSize: 13 }}><strong>مرحله فعلی:</strong> {activeCandidate.stage}</p>
                            <p style={{ fontSize: 13 }}><strong>مسئول پیگیری:</strong> {activeCandidate.owner}</p>
                        </div>
                        <div>
                            <div className="section-title">خلاصه رزومه</div>
                            <p className="muted" style={{ fontSize: 13 }}>{activeCandidate.resumeSummary}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate(`/recruitment/${activeCandidate.id}`)}>
                            مشاهده پروفایل کامل →
                        </button>
                    </div>
                )}
            </Drawer>

            {candidates.length === 0 && <EmptyState icon="🧩" title="داوطلبی ثبت نشده است" />}
        </div>
    );
}
