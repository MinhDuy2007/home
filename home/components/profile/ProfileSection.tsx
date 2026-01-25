"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Profile } from "@/lib/shortcuts";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ProfileEditor } from "./ProfileEditor";

interface ProfileSectionProps {
    profile: Profile;
    onSave: (profile: Profile) => void;
}

export function ProfileSection({ profile, onSave }: ProfileSectionProps) {
    const [isEditing, setIsEditing] = useState(false);

    // Get avatar source from profile configuration
    const getAvatarSrc = (): string => {
        if (profile.avatar.mode === "file" && profile.avatar.fileDataUrl) {
            return profile.avatar.fileDataUrl;
        }
        if (profile.avatar.mode === "url" && profile.avatar.url) {
            return profile.avatar.url;
        }
        return "/avatar.png"; // Fallback
    };

    const avatarSrc = getAvatarSrc();
    const isVideo = profile.avatar.mediaType === "video";

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4 mb-12"
            >
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-border">
                        {isVideo ? (
                            <video
                                src={avatarSrc}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={avatarSrc}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
                    <p className="text-muted-foreground">{profile.bio}</p>
                </div>
            </motion.div>

            <ProfileEditor
                profile={profile}
                open={isEditing}
                onOpenChange={setIsEditing}
                onSave={(updatedProfile: Profile) => {
                    onSave(updatedProfile);
                    setIsEditing(false);
                }}
            />
        </>
    );
}
