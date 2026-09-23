import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { employees as seedEmployees } from "../data/employees.js";
import { candidates as seedCandidates } from "../data/candidates.js";
import { projects as seedProjects } from "../data/projects.js";
import { tasks as seedTasks } from "../data/tasks.js";

const DataContext = createContext(null);
const STORAGE_KEY = "robin-demo-data-v1";

function loadData() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { employees: seedEmployees, candidates: seedCandidates, projects: seedProjects, tasks: seedTasks };
    } catch {
        console.warn("Demo data could not be loaded; using seed data.");
        return { employees: seedEmployees, candidates: seedCandidates, projects: seedProjects, tasks: seedTasks };
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
    const resetDemoData = useCallback(() => {
        const seedData = { employees: seedEmployees, candidates: seedCandidates, projects: seedProjects, tasks: seedTasks };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        setData(seedData);
    }, []);
    const value = useMemo(() => ({ ...data, addRecord, updateRecord, resetDemoData }), [data, addRecord, updateRecord, resetDemoData]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within DataProvider");
    return context;
}
