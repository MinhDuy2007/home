"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Shortcut } from "@/lib/shortcuts";
import { shouldAutoLaunchApp, setAppAutoLaunch } from "@/lib/appPreferences";
import { OpenAppDialog } from "@/components/OpenAppDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShortcutCardProps {
    shortcut: Shortcut;
    index: number;
    onEdit?: (shortcut: Shortcut) => void;
}

// Premium spring animation config
// Premium spring animation config - Snappy/Immediate response
const springConfig = {
    type: "spring" as const,
    stiffness: 500,
    damping: 25,
    mass: 0.5, // Lighter mass for faster start
};

export function ShortcutCard({ shortcut, index, onEdit }: ShortcutCardProps) {
    const [showAppDialog, setShowAppDialog] = useState(false);

    // Get the icon component from lucide-react
    const IconComponent =
        (LucideIcons[shortcut.icon as keyof typeof LucideIcons] as React.ComponentType<any>) ||
        LucideIcons.Link;

    const handleClick = () => {
        if (shortcut.type === "app") {
            // Check if user has set auto-launch preference
            if (shouldAutoLaunchApp(shortcut.id)) {
                // Auto-launch without showing dialog
                launchApp();
            } else {
                // Show confirmation dialog
                setShowAppDialog(true);
            }
        } else {
            // Web link - open normally with security best practices
            window.open(shortcut.url, "_blank", "noopener,noreferrer");
        }
    };

    const launchApp = () => {
        // Launch app protocol - ONLY the protocol URL, NO automatic fallback
        window.location.href = shortcut.url;
    };

    const handleAppConfirm = (rememberChoice: boolean) => {
        if (rememberChoice) {
            setAppAutoLaunch(shortcut.id, true);
        }
        setShowAppDialog(false);
        launchApp();
    };

    return (
        <>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="group relative"
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: springConfig,
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClick}
                                className="relative w-full flex flex-col items-center gap-3 p-6 rounded-2xl 
                                         bg-card/40 backdrop-blur-md border border-border/50 
                                         hover:bg-card/60 hover:border-primary 
                                         hover:shadow-[0_0_20px_var(--primary)] 
                                         transition-all duration-75 focus-visible-enhanced group-hover:z-10"
                            >
                                {/* Icon with lift animation */}
                                <motion.div
                                    whileHover={{ y: -3, scale: 1.1, transition: springConfig }}
                                    className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center 
                                             group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_var(--primary)] 
                                             transition-all duration-75"
                                >
                                    <IconComponent className="w-7 h-7 text-primary group-hover:brightness-125 transition-all duration-75" />
                                </motion.div>

                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-75">
                                        {shortcut.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-75">
                                        {shortcut.category}
                                    </span>
                                </div>

                                {/* App indicator badge */}
                                {shortcut.type === "app" && (
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary group-hover:shadow-[0_0_8px_var(--primary)] transition-all duration-75" />
                                )}
                            </motion.button>

                            {/* Edit button overlay - appears on hover if onEdit provided */}
                            {onEdit && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(shortcut);
                                    }}
                                    className="absolute top-2 left-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <LucideIcons.Edit2 className="w-3 h-3 text-muted-foreground hover:text-primary" />
                                </motion.button>
                            )}
                        </motion.div>
                    </TooltipTrigger>

                    <TooltipContent className="max-w-xs p-4" side="bottom">
                        <div className="space-y-1">
                            {(shortcut.description || "").split("\n\n").map((paragraph, i) => (
                                <p key={i} className="text-sm whitespace-pre-line">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* App Launch Dialog - only render for app shortcuts */}
            {shortcut.type === "app" && (
                <OpenAppDialog
                    open={showAppDialog}
                    onOpenChange={setShowAppDialog}
                    appName={shortcut.title}
                    appIcon={shortcut.icon}
                    onConfirm={handleAppConfirm}
                />
            )}
        </>
    );
}
