"use client";

import { useEffect, useState } from "react";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { SearchBar } from "@/components/search/SearchBar";
import { ShortcutGrid } from "@/components/shortcuts/ShortcutGrid";
import { CommandPalette } from "@/components/command/CommandPalette";
import { FocusMode } from "@/components/FocusMode";
import { Settings } from "@/components/Settings";
import { BackgroundRenderer } from "@/components/BackgroundRenderer";
import { ShortcutManager } from "@/components/ShortcutManager";
import {
  loadProfile,
  loadFocusMode,
  saveProfile,
  saveFocusMode,
} from "@/lib/storage";
import { loadShortcutsFromStorage, saveShortcutsToStorage } from "@/lib/shortcutStorage";
import { DEFAULT_SHORTCUTS } from "@/lib/shortcuts";
import { loadBackground, saveBackground } from "@/lib/background";
import type { Shortcut, Profile } from "@/lib/shortcuts";
import type { BackgroundConfig } from "@/lib/background";

export default function Home() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [background, setBackground] = useState<BackgroundConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedShortcuts = loadShortcutsFromStorage();
    setShortcuts(loadedShortcuts || DEFAULT_SHORTCUTS);
    setProfile(loadProfile());
    setFocusMode(loadFocusMode());
    setBackground(loadBackground());
    setMounted(true);
  }, []);

  const handleProfileSave = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  const handleFocusModeChange = (enabled: boolean) => {
    setFocusMode(enabled);
    saveFocusMode(enabled);
  };

  const handleBackgroundChange = (config: BackgroundConfig) => {
    setBackground(config);
    saveBackground(config);
  };

  const handleDataChange = () => {
    // Reload all data after import/reset
    const loadedShortcuts = loadShortcutsFromStorage();
    setShortcuts(loadedShortcuts || DEFAULT_SHORTCUTS);
    setProfile(loadProfile());
    setFocusMode(loadFocusMode());
    setBackground(loadBackground());
  };

  const handleShortcutsUpdate = (updated: Shortcut[]) => {
    setShortcuts(updated);
    saveShortcutsToStorage(updated);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !profile || !background) {
    return null;
  }

  return (
    <>
      {/* Background Renderer (fixed, behind everything) */}
      <BackgroundRenderer config={background} />

      <main className="min-h-screen px-6 py-12 max-w-7xl mx-auto relative">
        {/* Settings Button (Top Left) */}
        <Settings
          onDataChange={handleDataChange}
          background={background}
          onBackgroundChange={handleBackgroundChange}
        />

        {/* Focus Mode Toggle (Top Right) */}
        <FocusMode enabled={focusMode} onChange={handleFocusModeChange} />

        {/* Shortcut Manager Button */}
        <div className="flex justify-end mb-6">
          <ShortcutManager
            shortcuts={shortcuts}
            onUpdate={handleShortcutsUpdate}
          />
        </div>

        {/* Profile Section */}
        <ProfileSection profile={profile} onSave={handleProfileSave} />

        {/* Search Bar */}
        <SearchBar />

        {/* Shortcuts Grid */}
        <ShortcutGrid
          shortcuts={shortcuts}
          focusMode={focusMode}
        />

        {/* Command Palette (Ctrl+K) */}
        <CommandPalette shortcuts={shortcuts} />
      </main>
    </>
  );
}
