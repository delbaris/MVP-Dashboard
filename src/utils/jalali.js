const monthNames = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export const jalaliMonthNames = monthNames;
export const jalaliWeekdays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function toPersianDigits(value) {
    return String(value).replace(/\d/g, (digit) => persianDigits[digit]);
}

export function toLatinDigits(value) {
    return String(value)
        .replace(/[۰-۹]/g, (digit) => persianDigits.indexOf(digit))
        .replace(/[٠-٩]/g, (digit) => arabicDigits.indexOf(digit));
}

function div(a, b) {
    return Math.floor(a / b);
}

export function gregorianToJalali(gy, gm, gd) {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", { year: "numeric", month: "numeric", day: "numeric", numberingSystem: "latn" }).formatToParts(new Date(gy, gm - 1, gd));
    return {
        year: Number(parts.find((part) => part.type === "year").value),
        month: Number(parts.find((part) => part.type === "month").value),
        day: Number(parts.find((part) => part.type === "day").value),
    };
}

export function jalaliToGregorian(jy, jm, jd) {
    const target = `${jy}/${jm}/${jd}`;
    const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", { year: "numeric", month: "numeric", day: "numeric", numberingSystem: "latn" });
    const start = new Date(jy + 621, 2, 15);
    for (let offset = -30; offset <= 370; offset += 1) {
        const candidate = new Date(start);
        candidate.setDate(start.getDate() + offset);
        const parts = formatter.formatToParts(candidate);
        const value = `${parts.find((part) => part.type === "year").value}/${parts.find((part) => part.type === "month").value}/${parts.find((part) => part.type === "day").value}`;
        if (value === target) return { year: candidate.getFullYear(), month: candidate.getMonth() + 1, day: candidate.getDate() };
    }
    return { year: jy + 621, month: 3, day: 21 };
}

export function formatJalali(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return value;
    return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
}

export function todayJalali() {
    const now = new Date();
    const date = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function getJalaliMonthDays(year, month) {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    const current = jalaliToGregorian(year, 12, 1);
    const next = jalaliToGregorian(year + 1, 1, 1);
    return Math.round((Date.UTC(next.year, next.month - 1, next.day) - Date.UTC(current.year, current.month - 1, current.day)) / 86400000);
}

export function getJalaliMonthStartWeekday(year, month) {
    const gregorian = jalaliToGregorian(year, month, 1);
    return new Date(gregorian.year, gregorian.month - 1, gregorian.day).getDay() === 6
        ? 0
        : new Date(gregorian.year, gregorian.month - 1, gregorian.day).getDay() + 1;
}
