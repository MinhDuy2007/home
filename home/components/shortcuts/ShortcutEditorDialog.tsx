"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Link2, Zap } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Shortcut, ShortcutCategory } from "@/lib/shortcuts";
import { isValidUrl, isValidProtocolUrl, isValidTitle } from "@/lib/validation";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ShortcutEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shortcut?: Shortcut; // If editing existing
    onSave: (shortcut: Shortcut) => void;
    onDelete?: (id: string) => void;
}

const ICON_OPTIONS = [
    "Link",
    "Globe",
    "Star",
    "Heart",
    "Bookmark",
    "Youtube",
    "Facebook",
    "MessageSquare",
    "Github",
    "Sparkles",
    "Bot",
    "Search",
    "Rocket",
    "Brain",
    "Zap",
    "MessageCircle",
    "Video",
    "Code",
    "Terminal",
    "Laptop",
];

export function ShortcutEditorDialog({
    open,
    onOpenChange,
    shortcut,
    onSave,
    onDelete,
}: ShortcutEditorDialogProps) {
    const isEditing = !!shortcut;

    // Form state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<ShortcutCategory>("Work");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("Link");
    const [linkType, setLinkType] = useState<"web" | "app">("web");
    const [url, setUrl] = useState("");
    const [fallbackUrl, setFallbackUrl] = useState("");

    // Error states
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Populate form when editing
    useEffect(() => {
        if (shortcut) {
            setTitle(shortcut.title);
            setCategory(shortcut.category);
            setDescription(shortcut.description);
            setIcon(shortcut.icon);
            setLinkType(shortcut.type);
            setUrl(shortcut.url);
            setFallbackUrl(shortcut.fallbackUrl || "");
        } else {
            // Reset form for new shortcut
            setTitle("");
            setCategory("Work");
            setDescription("");
            setIcon("Link");
            setLinkType("web");
            setUrl("");
            setFallbackUrl("");
        }
        setErrors({});
    }, [shortcut, open]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!isValidTitle(title)) {
            newErrors.title = "Title is required";
        }

        if (!url) {
            newErrors.url = "URL is required";
        } else if (linkType === "web" && !isValidUrl(url)) {
            newErrors.url = "Please enter a valid URL (https://...)";
        } else if (linkType === "app" && !isValidProtocolUrl(url)) {
            newErrors.url = "Please enter a valid protocol URL (e.g., discord://)";
        }

        if (fallbackUrl && !isValidUrl(fallbackUrl)) {
            newErrors.fallbackUrl = "Please enter a valid fallback URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const newShortcut: Shortcut = {
            id: shortcut?.id || `shortcut-${Date.now()}`,
            title: title.trim(),
            category,
            description: description.trim(),
            icon,
            url: url.trim(),
            type: linkType,
            fallbackUrl: fallbackUrl.trim() || undefined,
            keywords: [title.toLowerCase()],
        };

        onSave(newShortcut);
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (!shortcut || !onDelete) return;

        if (
            confirm(
                `Are you sure you want to delete "${shortcut.title}"? This cannot be undone.`
            )
        ) {
            onDelete(shortcut.id);
            onOpenChange(false);
        }
    };

    // Get icon component for preview
    const IconComponent =
        (LucideIcons[icon as keyof typeof LucideIcons] as React.ComponentType<any>) ||
        LucideIcons.Link;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Shortcut" : "Add New Shortcut"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the shortcut details below"
                            : "Create a new shortcut to your favorite site"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Basic Information</h3>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., YouTube"
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={(value) => setCategory(value as ShortcutCategory)}>
                                <SelectTrigger id="category">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Work">Work</SelectItem>
                                    <SelectItem value="AI Tools">AI Tools</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description (shown in tooltip)
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this shortcut is for..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Icon</h3>

                        <div className="flex items-center gap-4">
                            {/* Preview */}
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <IconComponent className="w-8 h-8 text-primary" />
                            </div>

                            {/* Icon selector */}
                            <div className="flex-1 space-y-2">
                                <Select value={icon} onValueChange={setIcon}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        {ICON_OPTIONS.map((iconName) => {
                                            const Icon =
                                                (LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>) ||
                                                LucideIcons.Link;
                                            return (
                                                <SelectItem key={iconName} value={iconName}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        <span>{iconName}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Link Type */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Link Type</h3>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={linkType === "web" ? "default" : "outline"}
                                onClick={() => setLinkType("web")}
                                className="flex-1"
                            >
                                <Link2 className="w-4 h-4 mr-2" />
                                Web
                            </Button>
                            <Button
                                type="button"
                                variant={linkType === "app" ? "default" : "outline"}
                                onClick={() => setLinkType("app")}
                                className="flex-1"
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                App Protocol
                            </Button>
                        </div>

                        {/* URL Input */}
                        <div className="space-y-2">
                            <Label htmlFor="url">
                                {linkType === "web" ? "URL" : "Protocol URL"}{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder={
                                    linkType === "web"
                                        ? "https://example.com"
                                        : "discord://"
                                }
                                className={errors.url ? "border-destructive" : ""}
                            />
                            {errors.url && (
                                <p className="text-xs text-destructive">{errors.url}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {linkType === "web"
                                    ? "The web address to open"
                                    : "The app protocol (e.g., discord://, spotify://)"}
                            </p>
                        </div>

                        {/* Fallback URL (for app type) */}
                        {linkType === "app" && (
                            <div className="space-y-2">
                                <Label htmlFor="fallback">Fallback URL (optional)</Label>
                                <Input
                                    id="fallback"
                                    value={fallbackUrl}
                                    onChange={(e) => setFallbackUrl(e.target.value)}
                                    placeholder="https://discord.com"
                                    className={errors.fallbackUrl ? "border-destructive" : ""}
                                />
                                {errors.fallbackUrl && (
                                    <p className="text-xs text-destructive">
                                        {errors.fallbackUrl}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Web URL to use if the app is not installed
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between">
                    <div>
                        {isEditing && onDelete && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                size="sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {isEditing ? "Save Changes" : "Add Shortcut"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
