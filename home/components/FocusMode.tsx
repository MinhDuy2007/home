"use client";

import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FocusModeProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export function FocusMode({ enabled, onChange }: FocusModeProps) {
    return (
        <div className="fixed top-6 right-6 z-40">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border shadow-md hover:shadow-lg transition-all">
                            {enabled ? (
                                <Eye className="w-4 h-4 text-primary" />
                            ) : (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">Focus Mode</span>
                            <Switch checked={enabled} onCheckedChange={onChange} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm">
                            {enabled
                                ? "Focus mode active - hiding distractions"
                                : "Enable focus mode to hide entertainment apps"}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
