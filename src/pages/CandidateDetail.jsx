import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCandidateById } from "../data/candidates.js";
import EmptyState from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";

export default function CandidateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const candidate = getCandidateById(id);

    if (!candidate) {
        return <EmptyState icon="🧩" title="داوطلب یافت نشد" subtitle="این شناسه در Mock Data موجود نیست." />;
    }

    return (
        <div>
            <div className="back-link" onClick={() => navigate("/recruitment")}>→ بازگشت به Pipeline استخدام</div>

            <div className="detail-header card card-pad">
                <div className="detail-header-info">
                    <h1>{candidate.name}</h1>
                    <div className="muted">{candidate.appliedRole} · {candidate.experience} تجربه</div>
                    <div className="detail-header-meta">
                        <span>مرحله فعلی: {candidate.stage}</span>
                        <span>مسئول پیگیری: {candidate.owner}</span>
                        <span>آخرین فعالیت: {candidate.lastActivity}</span>
                    </div>
                </div>
                <div className="detail-header-actions">
                    <span className="score-pill" style={{ fontSize: 13 }}>امتیاز کل: {candidate.score}</span>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
                <div className="vstack" style={{ gap: 16 }}>
                    <div className="card card-pad">
                        <div className="section-title">خلاصه رزومه</div>
                        <p className="muted" style={{ fontSize: 13 }}>{candidate.resumeSummary}</p>
                    </div>

                    <div className="card card-pad">
                        <div className="section-title">تاریخچه مصاحبه‌ها</div>
                        {candidate.interviews.length === 0 ? (
                            <EmptyState icon="🗓️" title="هنوز مصاحبه‌ای برگزار نشده است" />
                        ) : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>مرحله</th>
                                            <th>مصاحبه‌کننده</th>
                                            <th>تاریخ</th>
                                            <th>نتیجه</th>
                                            <th>امتیاز</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidate.interviews.map((iv, i) => (
                                            <tr key={i} style={{ cursor: "default" }}>
                                                <td style={{ fontWeight: 600 }}>{iv.round}</td>
                                                <td>{iv.interviewer}</td>
                                                <td>{iv.date}</td>
                                                <td>{iv.result}</td>
                                                <td>{iv.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="card card-pad">
                        <div className="section-title">یادداشت‌ها</div>
                        <p className="muted" style={{ fontSize: 13 }}>{candidate.notes || "یادداشتی ثبت نشده است."}</p>
                    </div>
                </div>

                <div className="vstack" style={{ gap: 16 }}>
                    <div className="card card-pad">
                        <div className="section-title">امتیازها</div>
                        <div className="stat-mini-grid">
                            <div className="stat-mini">
                                <div className="stat-mini-value">{candidate.technicalScore}</div>
                                <div className="stat-mini-label">امتیاز فنی</div>
                            </div>
                            <div className="stat-mini">
                                <div className="stat-mini-value">{candidate.behavioralScore}</div>
                                <div className="stat-mini-label">امتیاز رفتاری</div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-pad">
                        <div className="section-title">نظر مدیر</div>
                        <p className="muted" style={{ fontSize: 13 }}>{candidate.managerReview || "هنوز نظری ثبت نشده است."}</p>
                    </div>

                    <div className="card card-pad">
                        <div className="section-title">وضعیت فعلی</div>
                        <Badge className="badge-info">{candidate.stage}</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
