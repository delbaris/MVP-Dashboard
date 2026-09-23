export const projectStatusMap = {
    "On Track": { label: "طبق برنامه", badge: "badge-success" },
    "At Risk": { label: "در معرض ریسک", badge: "badge-warning" },
    Delayed: { label: "تاخیر دارد", badge: "badge-danger" },
    Completed: { label: "تکمیل شده", badge: "badge-neutral" },
};

export const taskStatusMap = {
    Todo: { label: "در انتظار", badge: "badge-neutral" },
    "In Progress": { label: "در حال انجام", badge: "badge-info" },
    Review: { label: "در بازبینی", badge: "badge-warning" },
    Blocked: { label: "مسدود شده", badge: "badge-danger" },
    Done: { label: "انجام شده", badge: "badge-success" },
};

export const priorityMap = {
    بالا: { badge: "badge-danger" },
    متوسط: { badge: "badge-warning" },
    کم: { badge: "badge-neutral" },
};

export const employeeStatusMap = {
    Active: { label: "فعال", badge: "badge-success" },
    Onboarding: { label: "در حال آنبوردینگ", badge: "badge-info" },
    Available: { label: "بدون تخصیص", badge: "badge-neutral" },
    Inactive: { label: "غیرفعال", badge: "badge-danger" },
};

export const severityMap = {
    بالا: { badge: "badge-danger" },
    متوسط: { badge: "badge-warning" },
    کم: { badge: "badge-info" },
};

export const stageColor = {
    applicants: "#98a2b3",
    screening: "#2b6cb0",
    hr: "#6b46c1",
    technical: "#b8860b",
    management: "#c2410c",
    offer: "#1f8a5f",
    hired: "#0f6b4c",
    rejected: "#b23b3b",
};

export function formatPercent(n) {
    return `${n}٪`;
}
