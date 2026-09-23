import React from "react";

export default function FormField({ label, required = false, children, hint }) {
    return (
        <label className="form-field">
            <span>{label}{required && <b aria-hidden="true"> *</b>}</span>
            {children}
            {hint && <small>{hint}</small>}
        </label>
    );
}
