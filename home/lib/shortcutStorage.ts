/**
 * Shortcut Management Storage Helper
 * 
 * Handles all shortcut CRUD operations with localStorage persistence
 */

import { Shortcut } from "./shortcuts";

const STORAGE_KEY = "home.shortcuts.v1";

/**
 * Load shortcuts from localStorage
 */
export function loadShortcutsFromStorage(): Shortcut[] | null {
    if (typeof window === "undefined") return null;

    try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Error loading shortcuts:", error);
        return null;
    }
}

/**
 * Save shortcuts to localStorage
 */
export function saveShortcutsToStorage(shortcuts: Shortcut[]): void {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
    } catch (error) {
        console.error("Error saving shortcuts:", error);
    }
}

/**
 * Add a new shortcut
 */
export function addShortcut(shortcuts: Shortcut[], newShortcut: Shortcut): Shortcut[] {
    const updated = [...shortcuts, newShortcut];
    saveShortcutsToStorage(updated);
    return updated;
}

/**
 * Update an existing shortcut
 */
export function updateShortcut(shortcuts: Shortcut[], id: string, updates: Partial<Shortcut>): Shortcut[] {
    const updated = shortcuts.map((shortcut) =>
        shortcut.id === id ? { ...shortcut, ...updates } : shortcut
    );
    saveShortcutsToStorage(updated);
    return updated;
}

/**
 * Delete a shortcut
 */
export function deleteShortcut(shortcuts: Shortcut[], id: string): Shortcut[] {
    const updated = shortcuts.filter((shortcut) => shortcut.id !== id);
    saveShortcutsToStorage(updated);
    return updated;
}

/**
 * Delete all shortcuts in a category
 */
export function deleteCategory(shortcuts: Shortcut[], category: string): Shortcut[] {
    const updated = shortcuts.filter((shortcut) => shortcut.category !== category);
    saveShortcutsToStorage(updated);
    return updated;
}

/**
 * Get all unique categories from shortcuts
 */
export function getCategoriesFromShortcuts(shortcuts: Shortcut[]): string[] {
    const categories = new Set(shortcuts.map((s) => s.category));
    return Array.from(categories).sort();
}

/**
 * Generate a unique ID for a new shortcut
 */
export function generateShortcutId(): string {
    return `shortcut_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
