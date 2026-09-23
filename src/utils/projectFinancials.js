const DEMO_FINANCIALS = {
    "proj-01": { plannedHours: 1280, actualHours: 914, plannedBudget: 1850000000, actualCost: 1420000000 },
    "proj-02": { plannedHours: 1040, actualHours: 768, plannedBudget: 1480000000, actualCost: 1030000000 },
    "proj-03": { plannedHours: 920, actualHours: 702, plannedBudget: 1190000000, actualCost: 980000000 },
    "proj-04": { plannedHours: 1560, actualHours: 1196, plannedBudget: 2420000000, actualCost: 1980000000 },
    "proj-05": { plannedHours: 680, actualHours: 680, plannedBudget: 960000000, actualCost: 925000000 },
    "proj-06": { plannedHours: 760, actualHours: 488, plannedBudget: 1320000000, actualCost: 790000000 },
};

export function getProjectFinancials(project) {
    const values = project.financials || DEMO_FINANCIALS[project.id] || { plannedHours: 0, actualHours: 0, plannedBudget: 0, actualCost: 0 };
    const remainingBudget = Math.max(values.plannedBudget - values.actualCost, 0);
    const budgetVariance = values.plannedBudget ? ((values.actualCost - values.plannedBudget) / values.plannedBudget) * 100 : 0;
    return {
        ...values,
        remainingBudget,
        budgetVariance,
        source: project.financials ? "ثبت‌شده در پروژه" : "برآورد داده دمو",
    };
}

export function formatDemoMoney(value) {
    if (!value) return "—";
    if (value >= 1000000000) return `${(value / 1000000000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد تومان`;
    return `${Math.round(value / 1000000).toLocaleString("fa-IR")} میلیون تومان`;
}
