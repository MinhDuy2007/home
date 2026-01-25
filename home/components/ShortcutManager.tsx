"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Shortcut, ShortcutCategory } from "@/lib/shortcuts";
import { VN } from "@/lib/translations";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShortcutEditorDialog } from "./ShortcutEditorDialog";

interface ShortcutManagerProps {
    shortcuts: Shortcut[];
    onUpdate: (shortcuts: Shortcut[]) => void;
}

export function ShortcutManager({ shortcuts, onUpdate }: ShortcutManagerProps) {
    const [open, setOpen] = useState(false);
    const [selectedShortcut, setSelectedShortcut] = useState<Shortcut | null>(null);
    const [showEditor, setShowEditor] = useState(false);

    // Group shortcuts by category
    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
            acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
    }, {} as Record<string, Shortcut[]>);

    const handleAddNew = () => {
        setSelectedShortcut(null);
        setShowEditor(true);
    };

    const handleEdit = (shortcut: Shortcut) => {
        setSelectedShortcut(shortcut);
        setShowEditor(true);
    };

    const handleDelete = (id: string) => {
        const updated = shortcuts.filter((s) => s.id !== id);
        onUpdate(updated);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="outline">
                {VN.BUTTONS.QUAN_LY_PHIM_TAT}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{VN.BUTTONS.QUAN_LY_PHIM_TAT}</DialogTitle>
                        <DialogDescription>
                            Quản lý tất cả phím tắt của bạn
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end mb-4">
                        <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            {VN.BUTTONS.THEM_PHIM_TAT}
                        </Button>
                    </div>

                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-6">
                            {Object.entries(groupedShortcuts).map(([category, items]) => (
                                <div key={category} className="space-y-3">
                                    <h3 className="text-lg font-semibold border-b pb-2">
                                        {category} ({items.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {items.map((shortcut) => (
                                            <div
                                                key={shortcut.id}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">{shortcut.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {shortcut.url}
                                                    </div>
                                                    {shortcut.description && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {shortcut.description}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(shortcut)}
                                                    >
                                                        {VN.ACTIONS.SUA}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(shortcut.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        {VN.ACTIONS.XOA}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {shortcuts.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    {VN.EMPTY_STATES.KHONG_CO_PHIM_TAT}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {showEditor && (
                <ShortcutEditorDialog
                    shortcut={selectedShortcut}
                    shortcuts={shortcuts}
                    open={showEditor}
                    onOpenChange={setShowEditor}
                    onSave={(updated) => {
                        onUpdate(updated);
                        setShowEditor(false);
                    }}
                />
            )}
        </>
    );
}
