"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Link2, X } from "lucide-react";
import { Profile } from "@/lib/shortcuts";
import {
    fileToDataUrl,
    detectMediaTypeFromFile,
    detectMediaTypeFromUrl,
    validateAvatarFile,
    validateAvatarUrl,
    formatFileSize,
    AvatarConfig,
} from "@/lib/avatarUtils";
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

interface ProfileEditorProps {
    profile: Profile;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (profile: Profile) => void;
}

export function ProfileEditor({
    profile,
    open,
    onOpenChange,
    onSave,
}: ProfileEditorProps) {
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);
    const [avatarMode, setAvatarMode] = useState<"upload" | "url">(
        profile.avatar.mode === "file" ? "upload" : "url"
    );

    // Upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
    const [fileError, setFileError] = useState<string>("");

    // URL state
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar.url || "");
    const [urlError, setUrlError] = useState<string>("");
    const [urlLoading, setUrlLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens/closes or profile changes
    useEffect(() => {
        if (open) {
            setName(profile.name);
            setBio(profile.bio);
            setAvatarMode(profile.avatar.mode === "file" ? "upload" : "url");
            setAvatarUrl(profile.avatar.url || "");

            // Clear upload state
            setSelectedFile(null);
            setFilePreviewUrl("");
            setFileError("");
            setUrlError("");
        }
    }, [open, profile]);

    // Handle file selection
    const handleFileSelect = async (file: File) => {
        setFileError("");

        const validation = validateAvatarFile(file);
        if (!validation.valid) {
            setFileError(validation.error || "Invalid file");
            setSelectedFile(null);
            setFilePreviewUrl("");
            return;
        }

        setSelectedFile(file);

        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setFilePreviewUrl(objectUrl);
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreviewUrl("");
        setFileError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Validate URL
    const handleUrlBlur = () => {
        if (!avatarUrl.trim()) {
            setUrlError("");
            return;
        }

        const validation = validateAvatarUrl(avatarUrl);
        if (!validation.valid) {
            setUrlError(validation.error || "Invalid URL");
        } else {
            setUrlError("");
        }
    };

    // Get current avatar for preview
    const getCurrentAvatarSrc = (): string | null => {
        if (avatarMode === "upload") {
            if (filePreviewUrl) return filePreviewUrl;
            if (profile.avatar.mode === "file" && profile.avatar.fileDataUrl) {
                return profile.avatar.fileDataUrl;
            }
        } else {
            if (avatarUrl && !urlError) return avatarUrl;
            if (profile.avatar.mode === "url" && profile.avatar.url) {
                return profile.avatar.url;
            }
        }
        return null;
    };

    const getCurrentMediaType = (): "image" | "gif" | "video" => {
        if (avatarMode === "upload" && selectedFile) {
            return detectMediaTypeFromFile(selectedFile);
        }
        if (avatarMode === "url" && avatarUrl) {
            return detectMediaTypeFromUrl(avatarUrl);
        }
        return profile.avatar.mediaType;
    };

    // Handle save
    const handleSave = async () => {
        let newAvatar: AvatarConfig;

        if (avatarMode === "upload") {
            if (selectedFile) {
                // Convert file to base64 for storage
                try {
                    const dataUrl = await fileToDataUrl(selectedFile);
                    newAvatar = {
                        mode: "file",
                        fileDataUrl: dataUrl,
                        mediaType: detectMediaTypeFromFile(selectedFile),
                    };
                } catch (error) {
                    setFileError("Không thể xử lý tệp");
                    return;
                }
            } else {
                // Keep existing file avatar if no new file selected
                newAvatar = profile.avatar;
            }
        } else {
            // URL mode
            if (!avatarUrl.trim()) {
                setUrlError("URL là bắt buộc");
                return;
            }

            const validation = validateAvatarUrl(avatarUrl);
            if (!validation.valid) {
                setUrlError(validation.error || "URL không hợp lệ");
                return;
            }

            newAvatar = {
                mode: "url",
                url: avatarUrl,
                mediaType: detectMediaTypeFromUrl(avatarUrl),
            };
        }

        const updatedProfile: Profile = {
            name: name.trim(),
            bio: bio.trim(),
            avatar: newAvatar,
        };

        onSave(updatedProfile);
        onOpenChange(false);
    };

    const currentAvatarSrc = getCurrentAvatarSrc();
    const currentMediaType = getCurrentMediaType();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                    <DialogDescription>
                        Cập nhật tên, tiểu sử và ảnh đại diện của bạn
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tên của bạn"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Tiểu sử</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Một đoạn tiểu sử ngắn về bản thân bạn"
                            rows={2}
                        />
                    </div>

                    {/* Avatar Section */}
                    <div className="space-y-4">
                        <Label>Ảnh đại diện</Label>

                        {/* Tabs for Upload/URL */}
                        <Tabs
                            value={avatarMode}
                            onValueChange={(value) => setAvatarMode(value as "upload" | "url")}
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Tải lên
                                </TabsTrigger>
                                <TabsTrigger value="url">
                                    <Link2 className="w-4 h-4 mr-2" />
                                    URL
                                </TabsTrigger>
                            </TabsList>

                            {/* Upload Tab */}
                            <TabsContent value="upload" className="space-y-4">
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
                                >
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Nhấp để tải lên hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        JPG, PNG, WebP, GIF, MP4, WebM (tối đa 10MB)
                                    </p>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/mp4,video/webm"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />

                                {selectedFile && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile();
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                {fileError && (
                                    <p className="text-sm text-destructive">{fileError}</p>
                                )}
                            </TabsContent>

                            {/* URL Tab */}
                            <TabsContent value="url" className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        value={avatarUrl}
                                        onChange={(e) => {
                                            setAvatarUrl(e.target.value);
                                            setUrlError("");
                                        }}
                                        onBlur={handleUrlBlur}
                                        placeholder="https://example.com/avatar.png"
                                        className={urlError ? "border-destructive" : ""}
                                    />
                                    {urlError && (
                                        <p className="text-sm text-destructive">{urlError}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Nhập liên kết trực tiếp đến hình ảnh, GIF hoặc video
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Preview */}
                        {currentAvatarSrc && (
                            <div className="space-y-2">
                                <Label>Xem trước</Label>
                                <div className="flex justify-center p-4 rounded-lg bg-accent/30">
                                    {currentMediaType === "video" ? (
                                        <video
                                            src={currentAvatarSrc}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-32 h-32 rounded-full object-cover border-2 border-border shadow-lg"
                                            onError={() => {
                                                if (avatarMode === "url") {
                                                    setUrlError("Không thể tải video");
                                                }
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={currentAvatarSrc}
                                            alt="Avatar preview"
                                            className="w-32 h-32 rounded-full object-cover border-2 border-border shadow-lg"
                                            onError={() => {
                                                if (avatarMode === "url") {
                                                    setUrlError("Không thể tải hình ảnh");
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
