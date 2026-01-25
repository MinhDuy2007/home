"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Palette, Droplet } from "lucide-react";
import {
    BackgroundConfig,
    processBackgroundFile,
    GRADIENT_PRESETS,
} from "@/lib/background";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BackgroundSettingsProps {
    config: BackgroundConfig;
    onChange: (config: BackgroundConfig) => void;
}

export function BackgroundSettings({
    config,
    onChange,
}: BackgroundSettingsProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setWarning(null);

        const result = await processBackgroundFile(file);

        if (result.success && result.data && result.type) {
            onChange({
                ...config,
                type: result.type,
                value: result.data,
            });
            if (result.warning) {
                setWarning(result.warning);
            }
        } else {
            setError(result.error || "Failed to process file");
        }

        setIsUploading(false);
        // Reset input
        event.target.value = "";
    };

    const handleGradientSelect = (gradientValue: string) => {
        onChange({
            ...config,
            type: "gradient",
            value: gradientValue,
        });
    };

    const handleColorChange = (color: string) => {
        onChange({
            ...config,
            type: "color",
            value: color,
        });
    };

    const handleReset = () => {
        onChange({
            type: "none",
            value: "",
            blur: 0,
            dim: 0,
        });
        setError(null);
        setWarning(null);
    };

    return (
        <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
                <Label className="text-base font-semibold">Upload Background</Label>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => document.getElementById("bg-upload")?.click()}
                        disabled={isUploading}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Processing..." : "Upload Image/Video"}
                    </Button>
                    <input
                        id="bg-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    {config.type !== "none" && (
                        <Button variant="destructive" onClick={handleReset}>
                            <X className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Supported: JPG, PNG, GIF, WebP, MP4, WebM (Images under 5MB, Videos
                    under 10MB recommended)
                </p>
            </div>

            {/* Error/Warning Messages */}
            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                </div>
            )}
            {warning && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm">
                    {warning}
                </div>
            )}

            {/* Gradient Presets */}
            <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Gradient Presets
                </Label>
                <div className="grid grid-cols-3 gap-2">
                    {GRADIENT_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => handleGradientSelect(preset.value)}
                            className="h-16 rounded-lg border-2 border-border hover:border-primary transition-colors relative overflow-hidden group"
                            style={{ background: preset.value }}
                        >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {preset.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Solid Color */}
            <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                    <Droplet className="w-4 h-4" />
                    Solid Color
                </Label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={config.type === "color" ? config.value : "#000000"}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-10 w-20 rounded border border-border cursor-pointer"
                    />
                    <Button
                        variant="outline"
                        onClick={() => handleColorChange("#000000")}
                        className="flex-1"
                    >
                        Use Solid Color
                    </Button>
                </div>
            </div>

            {/* Blur Control */}
            {config.type !== "none" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Blur: {config.blur}px</Label>
                    </div>
                    <Slider
                        value={[config.blur]}
                        onValueChange={([value]) =>
                            onChange({ ...config, blur: value })
                        }
                        max={10}
                        step={1}
                        className="w-full"
                    />
                </div>
            )}

            {/* Dim Control */}
            {config.type !== "none" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Dim: {config.dim}%</Label>
                    </div>
                    <Slider
                        value={[config.dim]}
                        onValueChange={([value]) =>
                            onChange({ ...config, dim: value })
                        }
                        max={100}
                        step={5}
                        className="w-full"
                    />
                </div>
            )}

            {/* Current Background Info */}
            {config.type !== "none" && (
                <div className="p-3 rounded-lg bg-muted text-xs space-y-1">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        <span className="font-medium">
                            Current: {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
                        </span>
                    </div>
                    {config.blur > 0 && <div>Blur: {config.blur}px</div>}
                    {config.dim > 0 && <div>Dim: {config.dim}%</div>}
                </div>
            )}
        </div>
    );
}
