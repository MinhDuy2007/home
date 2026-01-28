"use client";

import { useState } from "react";
import {
    Settings as SettingsIcon,
    RotateCcw,
    Download,
    Upload,
    Moon,
    Sun,
    Palette,
    Database,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { downloadExport, importData, resetAllData } from "@/lib/storage";
import { BackgroundSettings } from "@/components/BackgroundSettings";
import type { BackgroundConfig } from "@/lib/background";

interface SettingsProps {
    onDataChange?: () => void;
    background?: BackgroundConfig;
    onBackgroundChange?: (config: BackgroundConfig) => void;
}

export function Settings({ onDataChange, background, onBackgroundChange }: SettingsProps) {
    const { theme, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    const handleReset = () => {
        if (
            confirm(
                "Bạn có chắc chắn muốn đặt lại tất cả dữ liệu về mặc định không? Hành động này không thể hoàn tác."
            )
        ) {
            resetAllData();
            if (onDataChange) onDataChange();
            alert("Tất cả dữ liệu đã được đặt lại về mặc định");
        }
    };

    const handleExport = () => {
        downloadExport();
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    if (importData(content)) {
                        alert("Nhập dữ liệu thành công!");
                        if (onDataChange) onDataChange();
                        setOpen(false);
                    } else {
                        alert("Nhập dữ liệu thất bại. Vui lòng kiểm tra định dạng tệp.");
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-6 left-6 z-40 rounded-full"
                >
                    <SettingsIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Cài đặt</DialogTitle>
                    <DialogDescription>
                        Tùy chỉnh bảng điều khiển và quản lý dữ liệu của bạn
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="appearance" className="flex-1">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="appearance">
                            <Sun className="w-4 h-4 mr-2" />
                            Giao diện
                        </TabsTrigger>
                        <TabsTrigger value="background">
                            <Palette className="w-4 h-4 mr-2" />
                            Hình nền
                        </TabsTrigger>
                        <TabsTrigger value="data">
                            <Database className="w-4 h-4 mr-2" />
                            Dữ liệu
                        </TabsTrigger>
                    </TabsList>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6 py-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Chủ đề</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === "light" ? "default" : "outline"}
                                    onClick={() => setTheme("light")}
                                    className="flex-1"
                                >
                                    <Sun className="w-4 h-4 mr-2" />
                                    Sáng
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "default" : "outline"}
                                    onClick={() => setTheme("dark")}
                                    className="flex-1"
                                >
                                    <Moon className="w-4 h-4 mr-2" />
                                    Tối
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Các tùy chọn giao diện khác sẽ sớm ra mắt: màu nhấn, cỡ chữ, kiểu thẻ.
                            </p>
                        </div>
                    </TabsContent>

                    {/* Background Tab */}
                    <TabsContent value="background" className="py-4 max-h-[60vh] overflow-y-auto">
                        {background && onBackgroundChange ? (
                            <BackgroundSettings
                                config={background}
                                onChange={onBackgroundChange}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Cài đặt hình nền không khả dụng
                            </p>
                        )}
                    </TabsContent>

                    {/* Data Management Tab */}
                    <TabsContent value="data" className="space-y-6 py-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Sao lưu & Khôi phục</h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    className="w-full justify-start"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Xuất dữ liệu (JSON)
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleImport}
                                    className="w-full justify-start"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Nhập dữ liệu (JSON)
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={handleReset}
                                    className="w-full justify-start"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Đặt lại về mặc định
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                Tất cả dữ liệu được lưu trữ cục bộ trong trình duyệt của bạn. Để chuyển cài đặt sang thiết bị hoặc trình duyệt khác, hãy sử dụng tính năng xuất/nhập. Dữ liệu xuất bao gồm phím tắt, hồ sơ, hình nền và tùy chọn.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
