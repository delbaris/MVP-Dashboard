import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { user, login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@robinparham.local");
    const [password, setPassword] = useState("123456");
    const [error, setError] = useState("");
    const logoSrc = `${import.meta.env.BASE_URL}main.png`;

    if (user) return <Navigate to={location.state?.from?.pathname || "/"} replace />;

    function handleSubmit(event) {
        event.preventDefault();
        const result = login(email, password);
        if (!result.success) {
            setError(result.message);
            return;
        }
        navigate(location.state?.from?.pathname || "/", { replace: true });
    }

    return (
        <main className="login-page">
            <section className="login-card card">
                <div className="login-brand">
                    <img className="login-brand-logo" src={logoSrc} alt="لوگوی پردازش روبین پرهام" />
                    <div>
                        <p className="login-eyebrow">پردازش روبین پرهام</p>
                        <span>Employee &amp; Project Operations</span>
                    </div>
                </div>
                <div className="login-heading">
                    <p className="login-kicker">فضای سازمانی امن</p>
                    <h1>ورود به مرکز فرماندهی</h1>
                    <p className="login-subtitle">برای مشاهده وضعیت کارکنان، پروژه‌ها و جریان عملیات وارد شوید.</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="login-email">ایمیل سازمانی<input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
                    <label htmlFor="login-password">رمز عبور<input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
                    {error && <div className="login-error" role="alert">{error}</div>}
                    <button className="btn btn-primary login-submit" type="submit"><Icon name="logout" size={17} /> ورود به سامانه</button>
                </form>
                <div className="login-demo-hint"><strong>نسخه نمایشی محلی</strong><span>admin@robinparham.local · 123456</span></div>
                <p className="login-security-note">این محیط برای ارائه Prototype آماده شده و احراز هویت نهایی در اتصال به Backend جایگزین خواهد شد.</p>
            </section>
        </main>
    );
}
