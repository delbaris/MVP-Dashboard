import React from "react";
import Modal from "./Modal.jsx";
import Icon from "./Icon.jsx";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "حذف اطلاعات", description, confirmLabel = "حذف", busy = false }) {
    return (
        <Modal open={open} onClose={onClose} title={title} width={430}>
            <div className="confirm-dialog">
                <div className="confirm-dialog-icon"><Icon name="trash" size={22} /></div>
                <h3>{title}</h3>
                <p>{description || "این اطلاعات حذف می‌شود و در این دموی محلی قابل بازگردانی نیست."}</p>
                <div className="confirm-dialog-actions">
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>انصراف</button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
                        <Icon name="trash" size={15} /> {busy ? "در حال انجام..." : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
