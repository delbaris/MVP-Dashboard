import React from "react";

export default function Avatar({ name, color = "#1f3a5f", size = "md" }) {
    const initials = name ? name.trim().split(" ").slice(0, 2).map((p) => p[0]).join("") : "?";
    const sizeClass = size === "sm" ? "avatar avatar-sm" : size === "lg" ? "avatar avatar-lg" : "avatar";
    return (
        <span className={sizeClass} style={{ background: color }} title={name}>
            {initials}
        </span>
    );
}
