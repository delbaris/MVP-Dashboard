import React from "react";
import { useData } from "../../context/DataContext.jsx";
import { formatDemoMoney, getProjectFinancials } from "../../utils/projectFinancials.js";
import { toPersianDigits } from "../../utils/jalali.js";

const COST_CATEGORIES = [
    { label: "نیروی انسانی", share: 0.68 },
    { label: "زیرساخت و خدمات", share: 0.18 },
    { label: "سایر هزینه‌ها", share: 0.14 },
];

function getIllustrativeCostBreakdown(actualCost) {
    let assignedTotal = 0;
    return COST_CATEGORIES.map((category, index) => {
        const amount = index === COST_CATEGORIES.length - 1
            ? actualCost - assignedTotal
            : Math.round(actualCost * category.share);
        assignedTotal += amount;
        return { ...category, amount };
    });
}

export default function ExecutiveFinanceReport() {
    const { projects } = useData();
    const totals = projects.reduce((summary, project) => {
        const financials = getProjectFinancials(project);
        return {
            budget: summary.budget + financials.plannedBudget,
            actual: summary.actual + financials.actualCost,
            remaining: summary.remaining + financials.remainingBudget,
        };
    }, { budget: 0, actual: 0, remaining: 0 });

    return (
        <section className="card card-pad finance-report" aria-labelledby="finance-report-title">
            <div className="card-title-row">
                <div>
                    <h2 id="finance-report-title">گزارش بودجه و ریز هزینه پروژه‌ها</h2>
                    <p className="muted">خلاصه مقایسه بودجه برنامه‌ریزی‌شده و هزینه‌های نمونه پروژه‌ها</p>
                </div>
                <span className="proto-badge">اعداد و دسته‌بندی‌ها نمایشی‌اند</span>
            </div>
            <div className="finance-report-totals">
                <div><span>بودجه کل نمونه</span><strong>{formatDemoMoney(totals.budget)}</strong></div>
                <div><span>هزینه کل نمونه</span><strong>{formatDemoMoney(totals.actual)}</strong></div>
                <div><span>مانده محاسباتی نمونه</span><strong>{formatDemoMoney(totals.remaining)}</strong></div>
            </div>
            <p className="finance-report-disclaimer">
                این گزارش از ارقام دمو استفاده می‌کند؛ دسته‌بندی هزینه‌ها فقط برای نمایش drill-down ساخته شده و سند مالی یا هزینه تأییدشده نیست.
            </p>
            <div className="finance-report-list">
                {projects.map((project) => {
                    const financials = getProjectFinancials(project);
                    const categories = getIllustrativeCostBreakdown(financials.actualCost);
                    return (
                        <details className="finance-report-project" key={project.id}>
                            <summary>
                                <span><strong>{project.name}</strong><small>بودجه: {formatDemoMoney(financials.plannedBudget)}</small></span>
                                <span><strong>{formatDemoMoney(financials.actualCost)}</strong><small>هزینه نمونه · {toPersianDigits(financials.budgetVariance.toFixed(1))}٪ انحراف</small></span>
                            </summary>
                            <div className="finance-report-costs">
                                {categories.map((category) => (
                                    <div key={category.label}>
                                        <span>{category.label}</span>
                                        <strong>{formatDemoMoney(category.amount)}</strong>
                                    </div>
                                ))}
                                <p className="faint">ریز ارقام واقعی و گزارش حسابداری پس از تعریف منبع داده و سیاست مالی متصل می‌شود.</p>
                            </div>
                        </details>
                    );
                })}
            </div>
        </section>
    );
}
