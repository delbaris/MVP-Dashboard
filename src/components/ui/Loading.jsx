import React from "react";

export default function Loading({ label = "در حال بارگذاری..." }) {
    return (
        <div className="loading-state">
            <span className="spinner" />
            <span>{label}</span>
        </div>
    );
}
