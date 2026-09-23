import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="empty-state card card-pad" style={{ marginTop: 40 }}>
            <div className="empty-icon">🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>صفحه مورد نظر یافت نشد</div>
            <p className="muted" style={{ marginBottom: 16 }}>ممکن است آدرس اشتباه باشد یا این صفحه در Prototype فعلی وجود نداشته باشد.</p>
            <Link to="/" className="btn btn-primary">بازگشت به مرکز فرماندهی</Link>
        </div>
    );
}
