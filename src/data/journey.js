// Employee Journey + Performance + Onboarding + Audit Trail (مفهومی)

export const journeyStages = [
    "Candidate",
    "Interview",
    "Offer",
    "Hired",
    "Onboarding",
    "Project Assignment",
    "Active Work",
    "Performance Review",
];

export const journeyStagesFa = {
    Candidate: "کاندیدا",
    Interview: "مصاحبه",
    Offer: "پیشنهاد همکاری",
    Hired: "استخدام",
    Onboarding: "آنبوردینگ",
    "Project Assignment": "تخصیص پروژه",
    "Active Work": "فعالیت کاری",
    "Performance Review": "بازبینی عملکرد",
};

// نگاشت وضعیت فعلی کارمند به مرحله سفر
export const employeeJourneyIndex = {
    "emp-01": 7,
    "emp-02": 7,
    "emp-03": 7,
    "emp-04": 6,
    "emp-05": 7,
    "emp-06": 6,
    "emp-07": 4,
    "emp-08": 7,
    "emp-09": 6,
    "emp-10": 7,
    "emp-11": 6,
    "emp-12": 7,
    "emp-13": 6,
    "emp-14": 6,
    "emp-15": 7,
};

export const performanceReviews = {
    "emp-02": [
        { period: "زمستان 1402", score: 92, reviewer: "امیر محمدی", note: "عملکرد فوق‌العاده در طراحی معماری بک‌اند." },
        { period: "بهار 1403", score: 89, reviewer: "امیر محمدی", note: "مدیریت موثر تیم در پروژه CRM." },
    ],
    "emp-05": [
        { period: "زمستان 1402", score: 90, reviewer: "امیر محمدی", note: "کیفیت بالای کد و مستندسازی." },
        { period: "بهار 1403", score: 87, reviewer: "امیر محمدی", note: "نیاز به بهبود تخمین زمانی Taskها." },
    ],
    "emp-04": [{ period: "بهار 1403", score: 78, reviewer: "علی رضایی", note: "پیشرفت خوب، نیاز به تسلط بیشتر بر تست." }],
};

export const onboardingStatus = {
    "emp-07": { completed: 60, pendingItems: ["آموزش ابزارهای داخلی", "معرفی به تیم مشتری"] },
    "emp-13": { completed: 85, pendingItems: ["تکمیل مستندات امنیتی"] },
};

export const auditTrail = [
    {
        time: "14:32",
        date: "1403-06-16",
        actor: "امیر محمدی",
        description: "وضعیت پروژه CRM v2 را از On Track به At Risk تغییر داد.",
    },
    {
        time: "11:15",
        date: "1403-06-15",
        actor: "سارا احمدی",
        description: "Deadline پروژه پلتفرم فروشگاه‌ساز را ویرایش کرد.",
    },
    {
        time: "16:40",
        date: "1403-06-14",
        actor: "لیلا شریفی",
        description: "وضعیت کاندیدای الناز کریمیان را به «پیشنهاد همکاری» تغییر داد.",
    },
    {
        time: "10:05",
        date: "1403-06-13",
        actor: "کیانوش رستمی",
        description: "Owner ریسک هزینه زیرساخت ابری را تعیین کرد.",
    },
    {
        time: "09:30",
        date: "1403-06-12",
        actor: "امیر محمدی",
        description: "نقش دسترسی سارا احمدی را به Project Manager تنظیم کرد.",
    },
];

export const roles = [
    { key: "executive", label: "Executive", labelFa: "مدیر ارشد", access: "دسترسی کامل به تمام بخش‌ها" },
    { key: "hr", label: "HR", labelFa: "منابع انسانی", access: "جذب و استخدام + پروفایل کارکنان" },
    { key: "pm", label: "Project Manager", labelFa: "مدیر پروژه", access: "پروژه‌ها و Taskهای مرتبط" },
    { key: "lead", label: "Team Lead", labelFa: "سرپرست تیم", access: "اعضای تیم و Taskهای تیم" },
    { key: "employee", label: "Employee", labelFa: "کارمند", access: "پروفایل شخصی و Taskهای خود" },
];
