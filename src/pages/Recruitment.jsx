import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { recruitmentFunnel } from "../data/candidates.js";
import Drawer from "../components/ui/Drawer.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import EntityModal from "../components/ui/EntityModal.jsx";
import Icon from "../components/ui/Icon.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Recruitment() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [activeCandidate, setActiveCandidate] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [sourceFormOpen, setSourceFormOpen] = useState(false);
    const [editingSource, setEditingSource] = useState(null);
    const [deletingSource, setDeletingSource] = useState(null);
    const { candidates: candidateRecords, recruitmentSources, addRecord, updateRecord, deleteRecord } = useData();
    const { pushToast } = useApp();
    const highlightStage = params.get("stage");
    const stageLabels = useMemo(() => Object.fromEntries(recruitmentFunnel.map((stage) => [stage.key, stage.label])), []);

    const columns = useMemo(() => {
        return recruitmentFunnel
            .filter((s) => s.key !== "rejected")
            .concat([{ key: "rejected", label: "رد شده", count: 0 }])
            .map((stage) => ({
                ...stage,
                candidates: candidateRecords.filter((c) => c.stageKey === stage.key),
            }));
    }, [candidateRecords]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>جذب و استخدام</h1>
                    <p className="page-subtitle">فضای کاری Pipeline استخدام - از دریافت رزومه تا استخدام نهایی</p>
                </div>
                <button className="btn btn-primary" onClick={() => setFormOpen(true)}><Icon name="users" size={16} /> ثبت داوطلب</button>
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
                            <p style={{ fontSize: 13 }}><strong>مرحله فعلی:</strong> {stageLabels[activeCandidate.stageKey] || activeCandidate.stage}</p>
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

            {candidateRecords.length === 0 && <EmptyState icon="🧩" title="داوطلبی ثبت نشده است" />}
            <EntityModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title="ثبت داوطلب جدید"
                description="این فرم مرحله‌ی اول ثبت سرنخ جذب است؛ مصاحبه و ارزیابی از پروفایل داوطلب ادامه پیدا می‌کند."
                fields={[
                    { name: "name", label: "نام و نام خانوادگی", required: true },
                    { name: "appliedRole", label: "سمت مورد درخواست", required: true },
                    { name: "experience", label: "سابقه کاری", required: true, placeholder: "مثلاً ۳ سال" },
                    { name: "owner", label: "مسئول پیگیری", required: true },
                    { name: "source", label: "منبع جذب", type: "select", required: true, options: recruitmentSources.map((source) => ({ value: source.name, label: source.name })) },
                    { name: "stageKey", label: "مرحله فعلی", type: "select", required: true, options: [{ value: "applicants", label: "رزومه دریافتی" }, { value: "screening", label: "غربالگری" }, { value: "technical", label: "مصاحبه فنی" }, { value: "management", label: "مصاحبه مدیریت" }, { value: "offer", label: "پیشنهاد همکاری" }] },
                    { name: "resumeSummary", label: "خلاصه رزومه", type: "textarea" },
                ]}
                initialValues={{ stageKey: "applicants", source: recruitmentSources[0]?.name || "", score: 0, lastActivity: "امروز", interviews: [] }}
                onSubmit={(values) => { addRecord("candidates", { ...values, id: `cand-demo-${Date.now()}`, stage: stageLabels[values.stageKey], technicalScore: 0, behavioralScore: 0, managerReview: "", notes: "" }); pushToast("داوطلب جدید با موفقیت ثبت شد", "success"); }}
            />
            <div className="card card-pad source-management">
                <div className="card-title-row">
                    <h3>منابع جذب</h3>
                    <button className="btn btn-sm btn-primary" type="button" onClick={() => { setEditingSource(null); setSourceFormOpen(true); }}>افزودن منبع</button>
                </div>
                <div className="source-list">
                    {recruitmentSources.map((source) => (
                        <div className="source-row" key={source.id}>
                            <span>{source.name}</span>
                            <span className="table-actions">
                                <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setEditingSource(source); setSourceFormOpen(true); }}><Icon name="edit" size={14} /> ویرایش</button>
                                <button type="button" className="btn btn-sm btn-danger" onClick={() => setDeletingSource(source)}><Icon name="trash" size={14} /> حذف</button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <EntityModal
                open={sourceFormOpen}
                onClose={() => { setSourceFormOpen(false); setEditingSource(null); }}
                title={editingSource ? "ویرایش منبع جذب" : "افزودن منبع جذب"}
                fields={[{ name: "name", label: "عنوان منبع", required: true, placeholder: "مثلاً جاب‌ویژن" }]}
                initialValues={editingSource || {}}
                onSubmit={(values) => {
                    if (editingSource) {
                        updateRecord("recruitmentSources", editingSource.id, values);
                        pushToast("منبع جذب با موفقیت ویرایش شد", "success");
                    } else {
                        addRecord("recruitmentSources", { ...values, id: `source-demo-${Date.now()}` });
                        pushToast("منبع جذب با موفقیت اضافه شد", "success");
                    }
                    setEditingSource(null);
                }}
            />
            <ConfirmDialog
                open={!!deletingSource}
                onClose={() => setDeletingSource(null)}
                title="حذف منبع جذب"
                description={`آیا از حذف «${deletingSource?.name || ""}» مطمئن هستید؟`}
                onConfirm={() => { deleteRecord("recruitmentSources", deletingSource.id); setDeletingSource(null); pushToast("منبع جذب با موفقیت حذف شد", "success"); }}
            />
        </div>
    );
}
