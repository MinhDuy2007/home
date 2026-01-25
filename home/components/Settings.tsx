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
                "Are you sure you want to reset all data to defaults? This cannot be undone."
            )
        ) {
            resetAllData();
            if (onDataChange) onDataChange();
            alert("All data has been reset to defaults");
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
                        alert("Data imported successfully!");
                        if (onDataChange) onDataChange();
                        setOpen(false);
                    } else {
                        alert("Failed to import data. Please check the file format.");
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
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your dashboard and manage your data
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="appearance" className="flex-1">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="appearance">
                            <Sun className="w-4 h-4 mr-2" />
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger value="background">
                            <Palette className="w-4 h-4 mr-2" />
                            Background
                        </TabsTrigger>
                        <TabsTrigger value="data">
                            <Database className="w-4 h-4 mr-2" />
                            Data
                        </TabsTrigger>
                    </TabsList>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6 py-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Theme</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant={theme === "light" ? "default" : "outline"}
                                    onClick={() => setTheme("light")}
                                    className="flex-1"
                                >
                                    <Sun className="w-4 h-4 mr-2" />
                                    Light
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "default" : "outline"}
                                    onClick={() => setTheme("dark")}
                                    className="flex-1"
                                >
                                    <Moon className="w-4 h-4 mr-2" />
                                    Dark
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                More appearance options coming soon: accent colors, font sizes,
                                card styles.
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
                                Background settings not available
                            </p>
                        )}
                    </TabsContent>

                    {/* Data Management Tab */}
                    <TabsContent value="data" className="space-y-6 py-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Backup & Restore</h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    className="w-full justify-start"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data (JSON)
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleImport}
                                    className="w-full justify-start"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import Data (JSON)
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={handleReset}
                                    className="w-full justify-start"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset to Defaults
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                All data is stored locally in your browser. To transfer settings
                                to another device or browser, use the export/import feature.
                                Exported data includes shortcuts, profile, background, and
                                preferences.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
