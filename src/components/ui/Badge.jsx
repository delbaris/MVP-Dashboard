import React from "react";

export default function Badge({ className = "badge-neutral", children }) {
    return <span className={`badge ${className}`}>{children}</span>;
}
