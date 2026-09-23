import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import ToastContainer from "../ui/Toast.jsx";
import { useApp } from "../../context/AppContext.jsx";

export default function AppLayout() {
    const [compact, setCompact] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { presentationMode } = useApp();

    return (
        <div className={`app-shell ${compact || presentationMode ? "sidebar-compact" : ""} ${presentationMode ? "presentation-mode" : ""}`}>
            <Sidebar
                compact={compact || presentationMode}
                onToggleCompact={() => setCompact((v) => !v)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />
            <div className="app-main">
                <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
