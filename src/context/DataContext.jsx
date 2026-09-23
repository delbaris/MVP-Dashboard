import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { employees as seedEmployees } from "../data/employees.js";
import { candidates as seedCandidates } from "../data/candidates.js";
import { projects as seedProjects } from "../data/projects.js";
import { tasks as seedTasks } from "../data/tasks.js";

const DataContext = createContext(null);
const STORAGE_KEY = "robin-demo-data-v1";
const seedRecruitmentSources = [
    { id: "source-jobvision", name: "جاب‌ویژن" },
    { id: "source-company", name: "سایت شرکت" },
    { id: "source-referral", name: "معرفی داخلی" },
    { id: "source-linkedin", name: "LinkedIn" },
];

function getSeedData() {
    return { employees: seedEmployees, candidates: seedCandidates, projects: seedProjects, tasks: seedTasks, recruitmentSources: seedRecruitmentSources };
}

function loadData() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? { ...getSeedData(), ...JSON.parse(saved) } : getSeedData();
    } catch {
        console.warn("Demo data could not be loaded; using seed data.");
        return getSeedData();
    }
}

export function DataProvider({ children }) {
    const [data, setData] = useState(loadData);

    const updateData = useCallback((key, updater) => {
        setData((previous) => {
            const next = { ...previous, [key]: typeof updater === "function" ? updater(previous[key]) : updater };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const addRecord = useCallback((key, record) => updateData(key, (items) => [...items, record]), [updateData]);
    const updateRecord = useCallback((key, id, changes) => updateData(key, (items) => items.map((item) => item.id === id ? { ...item, ...changes } : item)), [updateData]);
    const deleteRecord = useCallback((key, id) => updateData(key, (items) => items.filter((item) => item.id !== id)), [updateData]);
    const resetDemoData = useCallback(() => {
        const initialData = getSeedData();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        setData(initialData);
    }, []);
    const value = useMemo(() => ({ ...data, addRecord, updateRecord, deleteRecord, resetDemoData }), [data, addRecord, updateRecord, deleteRecord, resetDemoData]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within DataProvider");
    return context;
}
