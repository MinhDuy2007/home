"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Shortcut, filterShortcuts } from "@/lib/shortcuts";
import { handleAppProtocolLink } from "@/lib/utils";

interface CommandPaletteProps {
    shortcuts: Shortcut[];
}

export function CommandPalette({ shortcuts }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filteredShortcuts = filterShortcuts(shortcuts, query);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (shortcut: Shortcut) => {
        setOpen(false);
        setQuery("");

        // Small delay to allow the dialog to close first
        setTimeout(() => {
            if (shortcut.type === "app") {
                handleAppProtocolLink(shortcut.url, shortcut.fallbackUrl);
            } else {
                window.open(shortcut.url, "_blank");
            }
        }, 100);
    };

    // Group by category
    const groupedResults: Record<string, Shortcut[]> = {};
    filteredShortcuts.forEach((shortcut) => {
        if (!groupedResults[shortcut.category]) {
            groupedResults[shortcut.category] = [];
        }
        groupedResults[shortcut.category].push(shortcut);
    });

    return (
        <>
            {/* Keyboard shortcut hint */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all text-sm text-muted-foreground hover:text-foreground"
                >
                    <Search className="w-4 h-4" />
                    <span>Search shortcuts</span>
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border border-border">
                        {typeof navigator !== "undefined" &&
                            navigator.platform.toLowerCase().includes("mac")
                            ? "⌘K"
                            : "Ctrl+K"}
                    </kbd>
                </button>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search shortcuts..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        <div className="py-8 text-center">
                            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">No shortcuts found</p>
                        </div>
                    </CommandEmpty>

                    {Object.entries(groupedResults).map(([category, categoryShortcuts]) => (
                        <CommandGroup key={category} heading={category}>
                            {categoryShortcuts.map((shortcut) => {
                                const IconComponent =
                                    (LucideIcons[
                                        shortcut.icon as keyof typeof LucideIcons
                                    ] as React.ComponentType<any>) || LucideIcons.Link;

                                return (
                                    <CommandItem
                                        key={shortcut.id}
                                        onSelect={() => handleSelect(shortcut)}
                                        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium">{shortcut.title}</div>
                                            <div className="text-sm text-muted-foreground truncate">
                                                {(shortcut.description || "").split("\n")[0]}
                                            </div>
                                        </div>
                                        {shortcut.type === "app" && (
                                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                App
                                            </div>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    );
}
