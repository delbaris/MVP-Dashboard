import React, { useRef, useState } from "react";
import { getEmployeeById, employees } from "../data/employees.js";
import { projects } from "../data/projects.js";
import { tasks, getOverdueTasks } from "../data/tasks.js";
import { candidates } from "../data/candidates.js";
import { teams } from "../data/teams.js";
import { alerts } from "../data/alerts.js";

const SUGGESTED_PROMPTS = [
    "وضعیت کلی سازمان را خلاصه کن",
    "پروژه‌های دارای ریسک را نشان بده",
    "وضعیت علی رضایی چیست؟",
    "کدام Taskها عقب افتاده‌اند؟",
    "وضعیت استخدام‌ها را بررسی کن",
    "تیم‌های Overloaded را پیدا کن",
    "مهم‌ترین اتفاقات امروز چیست؟",
];

function computeWorkload() {
    return teams
        .map((team) => {
            const teamEmployeeIds = employees.filter((e) => e.teamId === team.id).map((e) => e.id);
            const activeTasks = tasks.filter((t) => teamEmployeeIds.includes(t.assigneeId) && t.status !== "Done");
            const assigned = activeTasks.length * 4;
            const pct = Math.round((assigned / team.capacity) * 100);
            return { ...team, assigned, pct };
        })
        .filter((t) => t.pct >= 90);
}

function generateAnswer(question) {
    const q = question.trim();

    if (/وضعیت کلی|خلاصه/.test(q)) {
        const activeEmployees = employees.filter((e) => e.status === "Active").length;
        const atRisk = projects.filter((p) => p.status === "At Risk" || p.status === "Delayed").length;
        const overdue = getOverdueTasks().length;
        return `وضعیت کلی سازمان مطلوب اما نیازمند پیگیری است:\n\n1. ${activeEmployees} کارمند در حال فعالیت هستند.\n2. ${atRisk} پروژه در وضعیت ریسک یا تاخیر قرار دارند.\n3. ${overdue} Task از موعد تحویل عبور کرده‌اند.\n\nپیشنهاد می‌شود ابتدا به پروژه CRM v2 و سامانه منابع انسانی داخلی رسیدگی شود.`;
    }

    if (/ریسک/.test(q)) {
        const risky = projects.filter((p) => p.status === "At Risk" || p.status === "Delayed");
        if (!risky.length) return "در حال حاضر پروژه‌ای با ریسک بالا شناسایی نشده است.";
        return `پروژه‌های دارای ریسک:\n\n${risky.map((p) => `• ${p.name} (${p.status}) — سلامت ${p.health}/100، پیشرفت ${p.progress}٪`).join("\n")}`;
    }

    if (/علی رضایی/.test(q)) {
        const emp = getEmployeeById("emp-02");
        if (!emp) return "اطلاعاتی برای این فرد یافت نشد.";
        const openTasks = tasks.filter((t) => t.assigneeId === emp.id && t.status !== "Done");
        return `${emp.name} در نقش ${emp.role} در تیم Backend فعالیت می‌کند.\nوضعیت: ${emp.status}\nتعداد Taskهای باز: ${openTasks.length}\nمهم‌ترین Task جاری: ${openTasks[0]?.title || "—"} (${openTasks[0]?.progress || 0}٪ پیشرفت)`;
    }

    if (/عقب افتاده|تاخیر/.test(q)) {
        const overdue = getOverdueTasks();
        if (!overdue.length) return "در حال حاضر Taskی از موعد تحویل عبور نکرده است.";
        return `Taskهای دارای تاخیر:\n\n${overdue
            .slice(0, 6)
            .map((t) => {
                const emp = getEmployeeById(t.assigneeId);
                return `• ${t.title} — مسئول: ${emp?.name} — مهلت: ${t.dueDate}`;
            })
            .join("\n")}`;
    }

    if (/استخدام/.test(q)) {
        const inProcess = candidates.filter((c) => !["hired", "rejected"].includes(c.stageKey));
        const hired = candidates.filter((c) => c.stageKey === "hired");
        return `وضعیت جذب و استخدام:\n\n1. ${inProcess.length} داوطلب در مراحل مختلف Pipeline هستند.\n2. ${hired.length} داوطلب اخیراً استخدام شده‌اند.\n3. مرحله «مصاحبه فنی» بیشترین حجم بررسی را دارد.`;
    }

    if (/Overloaded|overload/i.test(q)) {
        const overloaded = computeWorkload();
        if (!overloaded.length) return "در حال حاضر تیمی در وضعیت Overload قرار ندارد.";
        return `تیم‌های دارای بار کاری بالا (Overloaded):\n\n${overloaded.map((t) => `• ${t.nameFa} — ${t.assigned}/${t.capacity} (${t.pct}٪ ظرفیت)`).join("\n")}`;
    }

    if (/امروز|اتفاقات مهم/.test(q)) {
        const top = alerts.slice(0, 3);
        return `امروز ${top.length} مورد نیازمند توجه هستند:\n\n${top.map((a, i) => `${i + 1}. ${a.title}`).join("\n")}`;
    }

    return "این یک پاسخ نمایشی (Mock) از AI Operations Copilot است. در نسخه نهایی، این پنل به یک Agent متصل به داده واقعی سازمان (با رعایت سطح دسترسی نقش کاربر) وصل خواهد شد.";
}

export default function Copilot() {
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "سلام 👋 من دستیار عملیات هوش مصنوعی سازمان هستم. می‌توانید درباره کارکنان، پروژه‌ها، Taskها یا وضعیت کلی سازمان از من بپرسید.",
        },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const listRef = useRef(null);

    function send(text) {
        const question = (text ?? input).trim();
        if (!question) return;
        setMessages((prev) => [...prev, { role: "user", text: question }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            const answer = generateAnswer(question);
            setMessages((prev) => [...prev, { role: "ai", text: answer }]);
            setTyping(false);
            setTimeout(() => {
                listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
            }, 50);
        }, 700);
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>AI Operations Copilot</h1>
                    <p className="page-subtitle">دستیار هوش مصنوعی عملیات سازمان — پاسخ‌ها در این Prototype به صورت Mock تولید می‌شوند</p>
                </div>
                <span className="proto-badge">🧪 Prototype / Concept</span>
            </div>

            <div className="copilot-shell">
                <div className="card card-pad copilot-prompts">
                    <div className="section-title">پرسش‌های پیشنهادی</div>
                    {SUGGESTED_PROMPTS.map((p) => (
                        <button key={p} className="copilot-prompt-btn" onClick={() => send(p)}>
                            {p}
                        </button>
                    ))}
                </div>

                <div className="card copilot-chat">
                    <div className="copilot-messages" ref={listRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`copilot-msg ${m.role === "user" ? "copilot-msg-user" : "copilot-msg-ai"}`}>
                                {m.text}
                            </div>
                        ))}
                        {typing && <div className="copilot-typing">در حال تولید پاسخ...</div>}
                    </div>
                    <div className="copilot-input-row">
                        <input
                            placeholder="سؤال خود را درباره کارکنان، پروژه‌ها یا وضعیت سازمان وارد کنید..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                        />
                        <button className="btn btn-primary" onClick={() => send()}>ارسال</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
