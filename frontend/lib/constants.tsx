import {
    LayoutDashboard,
    MessageSquare,
    Database,
    Sparkles,
    BarChart3,
    HelpCircle,
    User,
    Users,
    CreditCard,
    Bell,
    Plug,
} from "lucide-react";

// ─── Sidebar navigation ──────────────────────────────────────────────────────

export const SIDEBAR_MAIN_NAV = [
    { id: "home", label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { id: "agents", label: "Agents", path: "/dashboard/agents", icon: MessageSquare },
    { id: "knowledge", label: "Knowledge", path: "/dashboard/knowledge", icon: Database },
    { id: "integrations", label: "Integrations", path: "/dashboard/connectors", icon: Plug },
    { id: "playground", label: "Playground", path: "/dashboard/playground", icon: Sparkles },
    { id: "analytics", label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
];

export const SIDEBAR_SECONDARY_NAV = [
    { id: "help", label: "Help & Support", path: "/dashboard/help", icon: HelpCircle },
];

export const SIDEBAR_SETTINGS_NAV = [
    { id: "general", label: "Profile", path: "/dashboard/settings?tab=general", icon: User },
    { id: "team", label: "Team Members", path: "/dashboard/settings?tab=team", icon: Users },
    { id: "billing", label: "Billing & Plans", path: "/dashboard/settings?tab=billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
];

// ─── Landing FAQs ────────────────────────────────────────────────────────────

export const FAQS = [
    {
        question: "How does the AI training work? ",
        answer:
"We use Retrieval-Augmented Generation (RAG). You provide documents or URLs, we convert them into high-dimensional vectors, and when a user asks a question our AI searches the most relevant context in your data to generate a precise, factual answer.",
    },
    {
        question: "Is my data secure? ",
        answer:
"Yes. We use enterprise-grade encryption for all data at rest and in transit. Your training data is never used to train our base AI models — your IP stays private.",
    },
    {
        question: "Do I need coding skills to integrate it? ",
        answer:
"No. Deploy the chatbot by pasting a single line of script into your site. For developers, we also offer a comprehensive API and React components for custom implementations.",
    },
    {
        question: "Can I customize the chatbot's personality? ",
        answer:
"Yes. In the dashboard you can define system prompts to give your chatbot a tone, set guardrails on what it discusses, and give it a name and avatar.",
    },
];

// ─── EmbedDrawer colour presets ──────────────────────────────────────────────

export const PRESET_COLORS = [
    { label: "Blue",   value: "#0052FF" },
    { label: "Black",  value: "#09090b" },
    { label: "Violet", value: "#7c3aed" },
    { label: "Green",  value: "#16a34a" },
    { label: "Rose",   value: "#e11d48" },
    { label: "Orange", value: "#ea580c" },
];

// ─── Model provider list ─────────────────────────────────────────────────────

export const LLM_PROVIDERS = [
    { label: "OpenAI", value: "openai" },
    { label: "Anthropic", value: "anthropic" },
    { label: "Google Gemini", value: "google" },
];

// ─── Plan identifiers ────────────────────────────────────────────────────────

export const PLANS = {
    FREE: "free",
    TRIAL: "trial",
    STARTER: "starter",
    PROFESSIONAL: "professional",
    ENTERPRISE: "enterprise",
};

// ─── Entity statuses ─────────────────────────────────────────────────────────

export const STATUS = {
    CREATING: "creating",
    FAILED: "failed",
    ACTIVE: "active",
};

// ─── Chat roles ──────────────────────────────────────────────────────────────

export const ROLES = {
    USER: "user",
    ASSISTANT: "assistant",
};
