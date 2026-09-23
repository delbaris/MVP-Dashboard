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
                <div className="login-brand-mark">RP</div>
                <p className="login-eyebrow">پردازش روبین پرهام</p>
                <h1>ورود به مرکز فرماندهی</h1>
                <p className="login-subtitle">برای ادامه، اطلاعات حساب سازمانی خود را وارد کنید.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <label>ایمیل سازمانی<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
                    <label>رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
                    {error && <div className="login-error" role="alert">{error}</div>}
                    <button className="btn btn-primary login-submit" type="submit"><Icon name="logout" size={17} /> ورود امن</button>
                </form>
                <div className="login-demo-hint"><strong>نسخه نمایشی محلی</strong><span>admin@robinparham.local · 123456</span></div>
            </section>
        </main>
    );
}
