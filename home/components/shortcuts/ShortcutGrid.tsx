"use client";

import { Shortcut, groupShortcutsByCategory } from "@/lib/shortcuts";
import { ShortcutCard } from "./ShortcutCard";
import { motion } from "framer-motion";

interface ShortcutGridProps {
    shortcuts: Shortcut[];
    focusMode: boolean;
    onEditShortcut?: (shortcut: Shortcut) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 25,
        },
    },
};

export function ShortcutGrid({ shortcuts, focusMode, onEditShortcut }: ShortcutGridProps) {
    // Filter out Entertainment category when focus mode is active
    const filteredShortcuts = focusMode
        ? shortcuts.filter((s) => s.category !== "Entertainment")
        : shortcuts;

    const groupedShortcuts = groupShortcutsByCategory(filteredShortcuts);

    if (filteredShortcuts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    No shortcuts available. Focus mode is hiding entertainment apps.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12 mb-20">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <motion.section
                    key={category}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h2
                        variants={headerVariants}
                        className="text-xl font-semibold mb-6 text-foreground/80"
                    >
                        {category}
                    </motion.h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {categoryShortcuts.map((shortcut, index) => (
                            <ShortcutCard
                                key={shortcut.id}
                                shortcut={shortcut}
                                index={index}
                                onEdit={onEditShortcut}
                            />
                        ))}
                    </div>
                </motion.section>
            ))}
        </div>
    );
}
