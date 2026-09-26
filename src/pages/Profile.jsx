import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/ui/Avatar.jsx";

export default function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>پروفایل من</h1>
                    <p className="page-subtitle">اطلاعات حساب کاربری واردشده</p>
                </div>
                <span className="proto-badge">نمایش دمو</span>
            </div>
            <section className="card card-pad profile-summary" aria-label="اطلاعات حساب کاربری">
                <Avatar name={user?.name || "کاربر"} color="#2b6cb0" size="lg" />
                <div>
                    <h2>{user?.name || "کاربر"}</h2>
                    <p className="muted">{user?.email || "ایمیل ثبت نشده"}</p>
                    <span className="tag">{user?.role || "نقش تعریف نشده"}</span>
                </div>
                <p className="profile-demo-note">
                    این نمونه فقط اطلاعات حساب دمو را نشان می‌دهد. اتصال حساب ورود به پرونده کارمند و نمایش/ویرایش اطلاعات پرسنلی به احراز هویت و مجوزهای سمت سرور نیاز دارد.
                </p>
            </section>
        </div>
    );
}
