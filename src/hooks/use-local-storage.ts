"use client";

import { useState, useEffect } from "react";

function getSavedValue<T>(key: string, initialValue: T | (() => T)): T {
    if (typeof window === "undefined") {
        return initialValue instanceof Function ? initialValue() : initialValue;
    }

    const savedValue = localStorage.getItem(key);
    if (savedValue) {
        try {
            return JSON.parse(savedValue);
        } catch (e) {
            console.error("Error parsing JSON from localStorage", e);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(() => {
        return getSavedValue(key, initialValue);
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue];
}
