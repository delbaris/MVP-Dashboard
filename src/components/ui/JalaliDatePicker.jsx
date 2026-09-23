import React, { useMemo, useState } from "react";
import Icon from "./Icon.jsx";
import {
    getJalaliMonthDays,
    getJalaliMonthStartWeekday,
    jalaliMonthNames,
    jalaliWeekdays,
    toLatinDigits,
    toPersianDigits,
    todayJalali,
} from "../../utils/jalali.js";

function parseValue(value) {
    const [year, month, day] = toLatinDigits(value || todayJalali()).split("-").map(Number);
    return { year, month, day };
}

export default function JalaliDatePicker({ value, onChange, placeholder = "انتخاب تاریخ" }) {
    const selected = parseValue(value);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState({ year: selected.year, month: selected.month });
    const days = useMemo(() => {
        const leading = getJalaliMonthStartWeekday(view.year, view.month);
        const total = getJalaliMonthDays(view.year, view.month);
        return [...Array(leading).fill(null), ...Array.from({ length: total }, (_, index) => index + 1)];
    }, [view]);

    function selectDay(day) {
        const next = `${view.year}-${String(view.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        onChange(next);
        setOpen(false);
    }

    function moveMonth(offset) {
        setView((previous) => {
            const month = previous.month + offset;
            return month < 1
                ? { year: previous.year - 1, month: 12 }
                : month > 12
                    ? { year: previous.year + 1, month: 1 }
                    : { year: previous.year, month };
        });
    }

    return (
        <div className="jalali-picker">
            <div className="jalali-picker-input">
                <input value={value ? toPersianDigits(value.replaceAll("-", "/")) : ""} readOnly placeholder={placeholder} onClick={() => setOpen((current) => { if (!current) setView(parseValue(value)); return !current; })} aria-label="تاریخ شمسی" />
                <button type="button" className="jalali-picker-trigger" onClick={() => setOpen((current) => { if (!current) setView(parseValue(value)); return !current; })} aria-label="باز کردن تقویم"><Icon name="calendar" size={16} /></button>
            </div>
            {open && (
                <div className="jalali-calendar" role="dialog" aria-label="تقویم جلالی">
                    <div className="jalali-calendar-header">
                        <button type="button" onClick={() => moveMonth(1)} aria-label="ماه بعد">‹</button>
                        <strong>{jalaliMonthNames[view.month - 1]} {toPersianDigits(view.year)}</strong>
                        <button type="button" onClick={() => moveMonth(-1)} aria-label="ماه قبل">›</button>
                    </div>
                    <div className="jalali-calendar-weekdays">
                        {jalaliWeekdays.map((weekday) => <span key={weekday}>{weekday.slice(0, 1)}</span>)}
                    </div>
                    <div className="jalali-calendar-grid">
                        {days.map((day, index) => (
                            <button key={`${view.year}-${view.month}-${index}`} type="button" disabled={!day} className={day === selected.day && view.year === selected.year && view.month === selected.month ? "selected" : ""} onClick={() => day && selectDay(day)}>
                                {day ? toPersianDigits(day) : ""}
                            </button>
                        ))}
                    </div>
                    <button type="button" className="jalali-calendar-today" onClick={() => { onChange(todayJalali()); setOpen(false); }}>امروز</button>
                </div>
            )}
        </div>
    );
}
