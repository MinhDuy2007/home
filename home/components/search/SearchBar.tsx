"use client";

import { useState, FormEvent } from "react";
import { Search, Image as ImageIcon, Video, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: FormEvent, searchType: string = "web") => {
        e.preventDefault();
        if (!query.trim()) return;

        const encodedQuery = encodeURIComponent(query.trim());
        let url = "";

        switch (searchType) {
            case "images":
                url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch`;
                break;
            case "youtube":
                url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
                break;
            case "github":
                url = `https://github.com/search?q=${encodedQuery}`;
                break;
            default:
                url = `https://www.google.com/search?q=${encodedQuery}`;
        }

        window.location.href = url;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full max-w-2xl mx-auto mb-12"
        >
            <form onSubmit={(e) => handleSubmit(e, "web")}>
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: isFocused ? 1.02 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn(
                            "relative flex items-center gap-2 px-6 py-4 rounded-full bg-card border-2 transition-all duration-200",
                            isFocused
                                ? "border-primary shadow-lg glow-primary"
                                : "border-border shadow-md hover:shadow-lg hover:border-border/80"
                        )}
                    >
                        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Search Google..."
                            className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground placeholder:transition-opacity focus:placeholder:opacity-50"
                        />
                    </motion.div>

                    {/* Quick Action Buttons */}
                    <AnimatePresence>
                        {query && isFocused && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border border-border rounded-lg shadow-lg flex gap-2"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "images")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors flex-1"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-sm">Images</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "youtube")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors flex-1"
                                >
                                    <Video className="w-4 h-4" />
                                    <span className="text-sm">YouTube</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--accent))" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={(e) => handleSubmit(e, "github")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors flex-1"
                                >
                                    <Github className="w-4 h-4" />
                                    <span className="text-sm">GitHub</span>
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </motion.div>
    );
}
