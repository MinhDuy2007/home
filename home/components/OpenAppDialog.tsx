"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ExternalLink } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OpenAppDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appName: string;
    appIcon: string;
    onConfirm: (rememberChoice: boolean) => void;
}

export function OpenAppDialog({
    open,
    onOpenChange,
    appName,
    appIcon,
    onConfirm,
}: OpenAppDialogProps) {
    const [rememberChoice, setRememberChoice] = useState(false);

    // Get icon component
    const IconComponent =
        (LucideIcons[appIcon as keyof typeof LucideIcons] as React.ComponentType<any>) ||
        LucideIcons.ExternalLink;

    const handleConfirm = () => {
        onConfirm(rememberChoice);
        setRememberChoice(false); // Reset for next time
    };

    const handleCancel = () => {
        onOpenChange(false);
        setRememberChoice(false);
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleConfirm();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-md backdrop-blur-sm"
                onKeyDown={handleKeyDown}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <DialogHeader className="flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-lg">Mở {appName}?</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Hành động này sẽ mở một ứng dụng bên ngoài trên thiết bị của bạn.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberChoice}
                                onCheckedChange={(checked) =>
                                    setRememberChoice(checked as boolean)
                                }
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm text-muted-foreground cursor-pointer"
                            >
                                Ghi nhớ lựa chọn của tôi và không hỏi lại
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                        >
                            <Button onClick={handleConfirm} className="w-full">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Mở ứng dụng
                            </Button>
                        </motion.div>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
