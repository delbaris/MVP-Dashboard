import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
    return (
        <nav className="breadcrumbs" aria-label="مسیر صفحه">
            {items.map((item, index) => (
                <React.Fragment key={`${item.label}-${index}`}>
                    {index > 0 && <span className="breadcrumbs-separator" aria-hidden="true">‹</span>}
                    {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="breadcrumbs-current" aria-current="page">{item.label}</span>}
                </React.Fragment>
            ))}
        </nav>
    );
}
