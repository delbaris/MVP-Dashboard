import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import ToastContainer from "../ui/Toast.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../ui/Modal.jsx";
import Icon from "../ui/Icon.jsx";

export default function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutPromptOpen, setLogoutPromptOpen] = useState(false);
    const { presentationMode } = useApp();

    return (
        <div className={`app-shell ${presentationMode ? "presentation-mode" : ""}`}>
            <Sidebar
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                onRequestLogout={() => setLogoutPromptOpen(true)}
            />
            <div className="app-main">
                <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} onRequestLogout={() => setLogoutPromptOpen(true)} />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
            <ToastContainer />
            <LogoutConfirmModal open={logoutPromptOpen} onClose={() => setLogoutPromptOpen(false)} />
        </div>
    );
}

function LogoutConfirmModal({ open, onClose }) {
    const { logout } = useAuth();
    return (
        <Modal open={open} onClose={onClose} title="خروج از حساب" width={430}>
            <div className="confirm-dialog">
                <div className="confirm-dialog-icon"><Icon name="logout" size={22} /></div>
                <h3>از حساب کاربری خارج می‌شوید؟</h3>
                <p>برای ورود دوباره باید اطلاعات حساب سازمانی خود را وارد کنید.</p>
                <div className="confirm-dialog-actions">
                    <button className="btn btn-ghost" onClick={onClose}>انصراف</button>
                    <button className="btn btn-danger" onClick={() => { logout(); onClose(); }}>خروج از سامانه</button>
                </div>
            </div>
        </Modal>
    );
}
