"use client";

import { useEffect, useRef, useState } from "react";
import { BackgroundConfig } from "@/lib/background";

interface BackgroundRendererProps {
    config: BackgroundConfig;
}

export function BackgroundRenderer({ config }: BackgroundRendererProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);

    // Reset error when config changes
    useEffect(() => {
        setHasError(false);
    }, [config.value]);

    // Handle video playback
    useEffect(() => {
        if (config.type === "video" && videoRef.current) {
            videoRef.current.play().catch(() => {
                setHasError(true);
            });
        }
    }, [config.type, config.value]);

    // Don't render anything if no background or error occurred
    if (config.type === "none" || hasError) {
        return null;
    }

    // Render based on background type
    const renderBackground = () => {
        switch (config.type) {
            case "color":
                return (
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: config.value }}
                    />
                );

            case "gradient":
                return (
                    <div
                        className="absolute inset-0"
                        style={{ background: config.value }}
                    />
                );

            case "image":
            case "gif":
                return (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${config.value})` }}
                        onError={() => setHasError(true)}
                    />
                );

            case "video":
                return (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={config.value}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() => setHasError(true)}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {renderBackground()}

            {/* Blur overlay */}
            {config.blur > 0 && (
                <div
                    className="absolute inset-0 backdrop-blur-sm"
                    style={{
                        backdropFilter: `blur(${config.blur}px)`,
                        WebkitBackdropFilter: `blur(${config.blur}px)`,
                    }}
                />
            )}

            {/* Dim overlay */}
            {config.dim > 0 && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: config.dim / 100 }}
                />
            )}
        </div>
    );
}
