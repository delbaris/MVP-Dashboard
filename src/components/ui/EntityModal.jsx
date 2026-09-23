import React, { useState } from "react";
import Modal from "./Modal.jsx";
import FormField from "./FormField.jsx";

export default function EntityModal({ open, onClose, title, description, fields, initialValues, onSubmit, submitLabel = "ذخیره اطلاعات" }) {
    const [values, setValues] = useState(initialValues);
    const [error, setError] = useState("");

    function update(name, value) {
        setValues((previous) => ({ ...previous, [name]: value }));
        setError("");
    }

    function submit(event) {
        event.preventDefault();
        const missing = fields.find((field) => field.required && !String(values[field.name] || "").trim());
        if (missing) {
            setError(`لطفاً «${missing.label}» را تکمیل کنید.`);
            return;
        }
        onSubmit(values);
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose} title={title} width={620}>
            <form className="entity-form" onSubmit={submit}>
                {description && <p className="entity-form-description">{description}</p>}
                <div className="entity-form-grid">
                    {fields.map((field) => (
                        <FormField key={field.name} label={field.label} required={field.required} hint={field.hint}>
                            {field.type === "textarea" ? (
                                <textarea rows={3} value={values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} placeholder={field.placeholder} />
                            ) : field.type === "select" ? (
                                <select value={values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)}>
                                    <option value="">انتخاب کنید</option>
                                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </select>
                            ) : (
                                <input type={field.type || "text"} value={values[field.name] || ""} onChange={(event) => update(field.name, event.target.value)} placeholder={field.placeholder} />
                            )}
                        </FormField>
                    ))}
                </div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <div className="entity-form-actions">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>انصراف</button>
                    <button type="submit" className="btn btn-primary">{submitLabel}</button>
                </div>
            </form>
        </Modal>
    );
}
