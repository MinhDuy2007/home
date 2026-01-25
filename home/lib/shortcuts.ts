/**
 * Shortcut Type Definitions and Default Data
 * 
 * This file defines the data structure for shortcuts and provides
 * the default set of shortcuts for the dashboard.
 */

export type ShortcutType = "web" | "app";

export type ShortcutCategory = "Giải trí" | "Công việc" | "Công cụ AI";

export interface Shortcut {
    id: string;
    title: string;
    icon: string; // lucide-react icon name
    category: ShortcutCategory;
    description: string; // Shown in tooltip
    url: string; // Primary URL (https:// for web, protocol:// for apps)
    type: ShortcutType;
    fallbackUrl?: string; // Fallback URL if app protocol fails
    keywords?: string[]; // For command palette search
}

export interface Profile {
    name: string;
    bio: string;
    avatar: {
        mode: "url" | "file";
        url?: string;
        fileDataUrl?: string;
        mediaType: "image" | "gif" | "video";
    };
}

/**
 * Default shortcuts configuration
 * Organized by category: Giải trí, Công việc, Công cụ AI
 */
export const DEFAULT_SHORTCUTS: Shortcut[] = [
    // GIẢI TRÍ
    {
        id: "youtube",
        title: "YouTube",
        icon: "Youtube",
        category: "Giải trí",
        description: "Watch videos, tutorials, music, and entertainment content",
        url: "https://www.youtube.com",
        type: "web",
        keywords: ["video", "watch", "music", "entertainment"],
    },
    {
        id: "facebook",
        title: "Facebook",
        icon: "Facebook",
        category: "Giải trí",
        description: "Connect with friends and family, share updates and photos",
        url: "https://www.facebook.com",
        type: "web",
        keywords: ["social", "friends", "photos"],
    },
    {
        id: "tiktok",
        title: "TikTok",
        icon: "Video",
        category: "Giải trí",
        description: "Short-form video content and trending challenges",
        url: "https://www.tiktok.com",
        type: "web",
        keywords: ["video", "shorts", "trending"],
    },
    {
        id: "discord",
        title: "Discord",
        icon: "MessageSquare",
        category: "Giải trí",
        description: "Voice, video, and text chat with communities and friends",
        url: "discord://",
        type: "app",
        fallbackUrl: "https://discord.com/app",
        keywords: ["chat", "voice", "community", "gaming"],
    },
    {
        id: "revoltpc",
        title: "RevoltPC",
        icon: "MessageCircle",
        category: "Giải trí",
        description: "Privacy-focused Discord alternative with end-to-end encryption",
        url: "revoltPC://",
        type: "app",
        fallbackUrl: "https://app.revolt.chat",
        keywords: ["chat", "privacy", "community"],
    },

    // CÔNG VIỆC
    {
        id: "zalo",
        title: "Zalo",
        icon: "MessageSquare",
        category: "Công việc",
        description: "Vietnamese messaging and collaboration platform",
        url: "Zalo://",
        type: "app",
        fallbackUrl: "https://chat.zalo.me",
        keywords: ["chat", "messaging", "vietnam", "work"],
    },
    {
        id: "github",
        title: "GitHub",
        icon: "Github",
        category: "Công việc",
        description: "Code repository hosting, version control, and collaboration",
        url: "https://github.com",
        type: "web",
        keywords: ["code", "git", "repository", "developer"],
    },
    {
        id: "antigravity",
        title: "Antigravity",
        icon: "Sparkles",
        category: "Công việc",
        description: "AI-powered development platform and coding assistant",
        url: "Antigravity://",
        type: "app",
        fallbackUrl: "https://antigravity.dev",
        keywords: ["ai", "coding", "assistant", "development"],
    },

    // CÔNG CỤ AI / CHATBOTS
    {
        id: "chatgpt",
        title: "ChatGPT",
        icon: "MessageSquare",
        category: "Công cụ AI",
        description: "Versatile AI assistant for writing, coding, brainstorming, and general tasks.\n\nBest for: Creative writing, code explanation, tutoring, brainstorming ideas.\n\nUse when: You need conversational help with diverse topics or want high-quality text generation.",
        url: "https://chat.openai.com",
        type: "web",
        keywords: ["ai", "chat", "assistant", "gpt", "openai"],
    },
    {
        id: "claude",
        title: "Claude",
        icon: "Bot",
        category: "Công cụ AI",
        description: "Advanced AI assistant with strong reasoning and long-context understanding.\n\nBest for: Analyzing long documents, nuanced reasoning, ethical guidance, coding with context.\n\nUse when: You need to process large texts or require thoughtful, detailed responses.",
        url: "https://claude.ai",
        type: "web",
        keywords: ["ai", "chat", "assistant", "anthropic", "reasoning"],
    },
    {
        id: "gemini",
        title: "Gemini",
        icon: "Sparkles",
        category: "Công cụ AI",
        description: "Google's multimodal AI with deep integration to Google services.\n\nBest for: Research, fact-checking, Google Workspace integration, multimodal tasks (text + images).\n\nUse when: You need access to Google's knowledge graph or want to work within Google ecosystem.",
        url: "https://gemini.google.com",
        type: "web",
        keywords: ["ai", "chat", "assistant", "google", "research"],
    },
    {
        id: "copilot",
        title: "Copilot",
        icon: "Laptop",
        category: "Công cụ AI",
        description: "Microsoft's AI assistant integrated with Bing search and Microsoft 365.\n\nBest for: Web search with AI summaries, Office 365 productivity, grounded responses.\n\nUse when: You need real-time web information or work heavily in Microsoft ecosystem.",
        url: "https://copilot.microsoft.com",
        type: "web",
        keywords: ["ai", "chat", "assistant", "microsoft", "bing"],
    },
    {
        id: "perplexity",
        title: "Perplexity",
        icon: "Search",
        category: "Công cụ AI",
        description: "AI-powered search engine with cited sources and real-time information.\n\nBest for: Research with citations, fact-checking, getting current information with sources.\n\nUse when: You need accurate, up-to-date answers with verifiable sources.",
        url: "https://www.perplexity.ai",
        type: "web",
        keywords: ["ai", "search", "research", "sources", "citations"],
    },
    {
        id: "deepseek",
        title: "DeepSeek",
        icon: "Brain",
        category: "Công cụ AI",
        description: "Open-source AI focused on coding and technical tasks.\n\nBest for: Code generation, debugging, technical documentation, algorithm design.\n\nUse when: You need specialized help with programming and technical problem-solving.",
        url: "https://chat.deepseek.com",
        type: "web",
        keywords: ["ai", "chat", "coding", "programming", "technical"],
    },
    {
        id: "poe",
        title: "Poe",
        icon: "Zap",
        category: "Công cụ AI",
        description: "Multi-bot platform with access to ChatGPT, Claude, and other AI models in one place.\n\nBest for: Comparing different AI responses, accessing multiple models, exploring specialized bots.\n\nUse when: You want to try different AI models or need variety in one interface.",
        url: "https://poe.com",
        type: "web",
        keywords: ["ai", "chat", "multi-model", "comparison"],
    },
    {
        id: "grok",
        title: "Grok",
        icon: "Rocket",
        category: "Công cụ AI",
        description: "xAI's conversational AI with real-time access to X (Twitter) data.\n\nBest for: Real-time social trends, current events, witty responses, X/Twitter insights.\n\nUse when: You want AI with personality and access to latest social media discussions.",
        url: "https://grok.x.ai",
        type: "web",
        keywords: ["ai", "chat", "twitter", "x", "social"],
    },
    {
        id: "mistral",
        title: "Mistral (Le Chat)",
        icon: "MessageCircle",
        category: "Công cụ AI",
        description: "European open-source AI focusing on privacy and multilingual support.\n\nBest for: Multilingual tasks, privacy-conscious use, European data compliance.\n\nUse when: You need multilingual support or prefer European AI with strong privacy standards.",
        url: "https://chat.mistral.ai",
        type: "web",
        keywords: ["ai", "chat", "mistral", "multilingual", "privacy", "european"],
    },
];

/**
 * Default profile configuration
 */
export const DEFAULT_PROFILE: Profile = {
    name: "Your Name",
    bio: "Developer • Designer • Creative Thinker",
    avatar: {
        mode: "url",
        url: "/avatar.png",
        mediaType: "image",
    },
};

/**
 * Helper Functions
 */

/**
 * Group shortcuts by category
 */
export function groupShortcutsByCategory(
    shortcuts: Shortcut[]
): Record<ShortcutCategory, Shortcut[]> {
    const grouped: Record<string, Shortcut[]> = {};

    shortcuts.forEach((shortcut) => {
        if (!grouped[shortcut.category]) {
            grouped[shortcut.category] = [];
        }
        grouped[shortcut.category].push(shortcut);
    });

    return grouped as Record<ShortcutCategory, Shortcut[]>;
}

/**
 * Filter shortcuts by search query
 */
export function filterShortcuts(
    shortcuts: Shortcut[],
    query: string
): Shortcut[] {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return shortcuts;

    return shortcuts.filter((shortcut) => {
        const searchableText = [
            shortcut.title,
            shortcut.description,
            shortcut.category,
            ...(shortcut.keywords || []),
        ]
            .join(" ")
            .toLowerCase();

        return searchableText.includes(lowerQuery);
    });
}

/**
 * Get all unique categories
 */
export function getCategories(): ShortcutCategory[] {
    return ["Giải trí", "Công việc", "Công cụ AI"];
}
