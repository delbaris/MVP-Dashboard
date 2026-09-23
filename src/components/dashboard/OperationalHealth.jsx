import React from "react";
import { toPersianDigits } from "../../utils/jalali.js";

export default function OperationalHealth({ score = 86 }) {
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#1f8a5f" : score >= 60 ? "#b8860b" : "#b23b3b";

    return (
        <div className="card card-pad operational-health">
            <div className="section-title">سلامت عملیاتی سازمان</div>
            <div className="oh-body">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#eef1f5" strokeWidth="9" />
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={color}
                        strokeWidth="9"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="46" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1c2536">
                        {toPersianDigits(score)}
                    </text>
                    <text x="50" y="63" textAnchor="middle" fontSize="10" fill="#98a2b3">
                        از ۱۰۰
                    </text>
                </svg>
                <div className="oh-note">
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>وضعیت کلی: {score >= 80 ? "مطلوب" : score >= 60 ? "قابل توجه" : "بحرانی"}</p>
                    <p className="muted" style={{ fontSize: 12.5 }}>
                        این شاخص به‌صورت Demo از ترکیب وضعیت پروژه‌ها، Taskهای معوق و روند استخدام محاسبه شده است.
                    </p>
                </div>
            </div>
        </div>
    );
}
