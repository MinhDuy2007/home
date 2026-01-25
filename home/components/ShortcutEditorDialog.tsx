"use client";

import { useState, useEffect } from "react";
import { Shortcut } from "@/lib/shortcuts";
import { VN } from "@/lib/translations";
import {
    generateShortcutId,
    addShortcut,
    updateShortcut,
    deleteShortcut,
    getCategoriesFromShortcuts,
} from "@/lib/shortcutStorage";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShortcutEditorDialogProps {
    shortcut: Shortcut | null; // null = adding new
    shortcuts: Shortcut[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (shortcuts: Shortcut[]) => void;
}

export function ShortcutEditorDialog({
    shortcut,
    shortcuts,
    open,
    onOpenChange,
    onSave,
}: ShortcutEditorDialogProps) {
    const isEditing = shortcut !== null;

    // Form state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Giải trí");
    const [newCategory, setNewCategory] = useState("");
    const [description, setDescription] = useState("");
    const [linkType, setLinkType] = useState<"web" | "app">("web");
    const [url, setUrl] = useState("");
    const [fallbackUrl, setFallbackUrl] = useState("");
    const [icon, setIcon] = useState("Link");

    // Validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const existingCategories = getCategoriesFromShortcuts(shortcuts);

    // Initialize form when shortcut changes
    useEffect(() => {
        if (shortcut) {
            setTitle(shortcut.title);
            setCategory(shortcut.category);
            setDescription(shortcut.description || "");
            setLinkType(shortcut.type);
            setUrl(shortcut.url);
            setFallbackUrl(shortcut.fallbackUrl || "");
            setIcon(shortcut.icon);
        } else {
            // Reset for new shortcut
            setTitle("");
            setCategory(existingCategories[0] || "Giải trí");
            setNewCategory("");
            setDescription("");
            setLinkType("web");
            setUrl("");
            setFallbackUrl("");
            setIcon("Link");
        }
        setErrors({});
    }, [shortcut, open]);

    // Validation
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = VN.VALIDATION.TEN_BAT_BUOC;
        }

        const finalCategory = newCategory.trim() || category;
        if (!finalCategory) {
            newErrors.category = "Hạng mục là bắt buộc";
        }

        if (!url.trim()) {
            newErrors.url = VN.VALIDATION.URL_BAT_BUOC;
        } else if (linkType === "web") {
            if (!url.match(/^https?:\/\/.+/)) {
                newErrors.url = VN.VALIDATION.URL_KHONG_HOP_LE;
            }
        } else if (linkType === "app") {
            if (!url.includes("://")) {
                newErrors.url = VN.VALIDATION.URL_GIAO_THUC_KHONG_HOP_LE;
            }
        }

        if (fallbackUrl.trim() && !fallbackUrl.match(/^https?:\/\/.+/)) {
            newErrors.fallbackUrl = VN.VALIDATION.URL_DU_PHONG_KHONG_HOP_LE;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const finalCategory = newCategory.trim() || category;

        const shortcutData: Shortcut = {
            id: shortcut?.id || generateShortcutId(),
            title: title.trim(),
            category: finalCategory,
            description: description.trim() || undefined,
            type: linkType,
            url: url.trim(),
            fallbackUrl: fallbackUrl.trim() || undefined,
            icon,
            keywords: [], // Can be enhanced later
        };

        let updated: Shortcut[];
        if (isEditing) {
            updated = updateShortcut(shortcuts, shortcut.id, shortcutData);
        } else {
            updated = addShortcut(shortcuts, shortcutData);
        }

        onSave(updated);
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (!shortcut) return;
        const updated = deleteShortcut(shortcuts, shortcut.id);
        onSave(updated);
        setShowDeleteConfirm(false);
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? VN.BUTTONS.SUA_PHIM_TAT : VN.BUTTONS.THEM_PHIM_TAT}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Chỉnh sửa thông tin phím tắt"
                                : "Thêm phím tắt mới vào bảng điều khiển"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">{VN.LABELS.TEN} *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={VN.PLACEHOLDERS.NHAP_TEN}
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>{VN.LABELS.HANG_MUC} *</Label>
                            {existingCategories.length > 0 ? (
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {existingCategories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : null}

                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Hoặc nhập hạng mục mới..."
                                className={errors.category ? "border-destructive" : ""}
                            />
                            {errors.category && (
                                <p className="text-sm text-destructive">{errors.category}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">{VN.LABELS.MO_TA}</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={VN.PLACEHOLDERS.NHAP_MO_TA}
                                rows={2}
                            />
                        </div>

                        {/* Link Type */}
                        <div className="space-y-2">
                            <Label>{VN.LABELS.LOAI_LIEN_KET} *</Label>
                            <Tabs value={linkType} onValueChange={(v) => setLinkType(v as "web" | "app")}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="web">{VN.LINK_TYPES.WEB}</TabsTrigger>
                                    <TabsTrigger value="app">{VN.LINK_TYPES.APP}</TabsTrigger>
                                </TabsList>

                                <TabsContent value="web" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="web-url">URL *</Label>
                                        <Input
                                            id="web-url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className={errors.url ? "border-destructive" : ""}
                                        />
                                        {errors.url && (
                                            <p className="text-sm text-destructive">{errors.url}</p>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="app" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="protocol-url">URL giao thức *</Label>
                                        <Input
                                            id="protocol-url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="discord://"
                                            className={errors.url ? "border-destructive" : ""}
                                        />
                                        {errors.url && (
                                            <p className="text-sm text-destructive">{errors.url}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Ví dụ: discord://, spotify://, steam://
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fallback-url">URL dự phòng (tùy chọn)</Label>
                                        <Input
                                            id="fallback-url"
                                            value={fallbackUrl}
                                            onChange={(e) => setFallbackUrl(e.target.value)}
                                            placeholder="https://discord.com/app"
                                            className={errors.fallbackUrl ? "border-destructive" : ""}
                                        />
                                        {errors.fallbackUrl && (
                                            <p className="text-sm text-destructive">{errors.fallbackUrl}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Chỉ được sử dụng khi người dùng chọn "Mở bản web"
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Icon */}
                        <div className="space-y-2">
                            <Label htmlFor="icon">Tên biểu tượng</Label>
                            <Input
                                id="icon"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                placeholder="Link"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tên biểu tượng Lucide (ví dụ: Github, Youtube, MessageSquare)
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between">
                        <div>
                            {isEditing && (
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    {VN.ACTIONS.XOA}
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                {VN.ACTIONS.HUY}
                            </Button>
                            <Button onClick={handleSave}>{VN.ACTIONS.LUU}</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{VN.DIALOGS.XOA_PHIM_TAT.TITLE}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {VN.DIALOGS.XOA_PHIM_TAT.MESSAGE}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{VN.ACTIONS.HUY}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {VN.ACTIONS.XOA}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
