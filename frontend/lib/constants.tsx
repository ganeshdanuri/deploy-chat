import {
    HiGlobe, HiChartBar, HiUserGroup, HiShieldCheck, HiDatabase,
    HiLightningBolt, HiColorSwatch, HiCode, HiSparkles, HiDocumentText,
    HiCursorClick, HiChatAlt2, HiHome, HiQuestionMarkCircle, HiUser,
    HiUsers, HiCreditCard, HiKey, HiBell, HiShare
} from "react-icons/hi";
import { FaBrain } from "react-icons/fa";
import { MdIntegrationInstructions } from "react-icons/md";
import { SiNotion, SiGoogledrive, SiSlack, SiGithub, SiIntercom } from "react-icons/si";

// ─── Hero Checkmarks ─────────────────────────────────────────────────────────
export const HERO_CHECKMARKS = [
    "No credit card required",
    "GDPR Compliant",
    "Free trial",
];

// ─── Navbar Links ────────────────────────────────────────────────────────────
export const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "Integration", href: "#integration" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
];

// ─── Banner Keywords ─────────────────────────────────────────────────────────
export const BANNER_KEYWORDS = [
    { label: "AI Customer Support", icon: HiSparkles },
    { label: "Train on Your Docs", icon: HiDocumentText },
    { label: "One-line Embed", icon: HiCode },
    { label: "No Watermarks", icon: HiShieldCheck },
    { label: "Custom Branding", icon: HiColorSwatch },
    { label: "Works with Any Website", icon: HiGlobe },
    { label: "Live in Minutes", icon: HiLightningBolt },
    { label: "No Coding Required", icon: HiCursorClick },
    { label: "Powered by RAG", icon: FaBrain },
];

// ─── Platform Features (FeaturesSection) ─────────────────────────────────────
export const PLATFORM_FEATURES = [
    {
        id: 1,
        title: "Easy Integration",
        description: "Add AI chatbots to your website with just a few lines of code. No complex setup required.",
        icon: MdIntegrationInstructions,
        color: "#262ef2",
        span: "col-span-1 md:col-span-2 lg:col-span-1",
    },
    {
        id: 2,
        title: "Custom Training",
        description: "Train your chatbot on your own content, documentation, and knowledge base for accurate responses.",
        icon: FaBrain,
        color: "#262ef2",
        span: "col-span-1 md:col-span-2 lg:col-span-2",
    },
    {
        id: 3,
        title: "24/7 Support",
        description: "Your AI chatbot works around the clock to provide instant answers.",
        icon: HiGlobe,
        color: "#262ef2",
        span: "col-span-1",
    },
    {
        id: 4,
        title: "Analytics Dashboard",
        description: "Track conversations, user satisfaction, and chatbot performance.",
        icon: HiChartBar,
        color: "#262ef2",
        span: "col-span-1",
    },
    {
        id: 5,
        title: "Multi-language",
        description: "Support customers in multiple languages with AI-powered translation.",
        icon: HiUserGroup,
        color: "#262ef2",
        span: "col-span-1 md:col-span-2 lg:col-span-1",
    },
    {
        id: 6,
        title: "Enterprise Security",
        description: "Bank-grade encryption and GDPR compliance out of the box.",
        icon: HiShieldCheck,
        color: "#262ef2",
        span: "col-span-1 md:col-span-3 lg:col-span-3",
    },
];

// ─── Integration Steps ───────────────────────────────────────────────────────
export interface IntegrationStep {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const INTEGRATION_STEPS: IntegrationStep[] = [
    {
        id: "01",
        title: "Connect your data",
        description:
            "Upload PDFs, crawl your site, or sync from Notion and Google Drive. Stays up to date automatically.",
        icon: HiDatabase,
    },
    {
        id: "02",
        title: "Train your AI",
        description:
            "Our RAG engine processes and indexes your knowledge base. Refine responses in the live playground.",
        icon: HiLightningBolt,
    },
    {
        id: "03",
        title: "Style to your brand",
        description:
            "Set colors, logo, and tone of voice. No 'Powered by DeployChat' badge. Your widget, your identity.",
        icon: HiColorSwatch,
    },
    {
        id: "04",
        title: "Paste one line and ship",
        description:
            "Copy the snippet below into your <head>. Works with React, Next.js, WordPress — anything with HTML.",
        icon: HiCode,
    },
];

export const EMBED_SNIPPET = `<script
  src="https://cdn.deploychat.io/widget.js"
  data-bot-id="YOUR_BOT_ID"
  data-theme="custom"
  async
></script>`;

export const COMPATIBLE_TECHS = [
    "React",
    "Next.js",
    "Vue",
    "WordPress",
    "Webflow",
    "Shopify",
    "Any HTML",
];

// ─── Pricing Plans ───────────────────────────────────────────────────────────
export interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: "Free",
        price: "0",
        description: "Test the platform with a small usage limit to see how it works.",
        features: [
            "1 AI Chatbot",
            "10 Messages included",
            "Basic Analytics",
            "Community Support",
        ],
        cta: "Start Free",
        popular: false,
    },
    {
        name: "Starter",
        price: "19",
        description: "Perfect for personal projects and small websites.",
        features: [
            "1 AI Chatbot",
            "1,000 Messages / month",
            "Standard Analytics",
            "Email Support",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Professional",
        price: "49",
        description: "For scaling startups with heavy usage needs.",
        features: [
            "5 AI Chatbots",
            "10,000 Messages / month",
            "Advanced Analytics",
            "Priority Support",
            "Remove Branding",
        ],
        cta: "Start Professional",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Full control and white-labeled infrastructure.",
        features: [
            "Unlimited Chatbots & Messages",
            "Dedicated Azure Server",
            "SLA Support",
            "Custom Security Audits",
            "Single Sign-On (SSO)",
        ],
        cta: "Talk to Sales",
        popular: false,
    },
];

// ─── FAQs ────────────────────────────────────────────────────────────────────
export const FAQS = [
    {
        question: "How does the AI training work?",
        answer: "We use a technique called Retrieval-Augmented Generation (RAG). You provide documents or website URLs, and we convert them into high-dimensional vectors. When a user asks a question, our AI searches for the most relevant context in your data to generate a precise, factual answer.",
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade encryption for all data at rest and in transit. Your training data is never used to train our base AI models, ensuring your intellectual property remains private and proprietary.",
    },
    {
        question: "Do I need coding skills to integrate it?",
        answer: "No. You can deploy our chatbot by simply copying and pasting a single line of script into your website. For developers, we also offer a comprehensive API and React components for more custom implementations.",
    },
    {
        question: "Can I customize the chatbot's personality?",
        answer: "Yes. In the dashboard, you can define 'System Prompts' to give your chatbot a specific tone, set boundaries on what it should discuss, and even give it a name and custom avatar.",
    },
];

// ─── Social Links ────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
    twitter: "https://x.com/deploychat",
    github: "https://github.com/ganeshdanuri/docking",
    linkedin: "https://linkedin.com/company/deploychat",
};

// ─── Footer Links ────────────────────────────────────────────────────────────
export const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "Integrations", href: "#integration" },
            { name: "Pricing", href: "#pricing" },
            { name: "Changelog", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Documentation", href: "#" },
            { name: "Help Center", href: "#" },
            { name: "API Reference", href: "#" },
            { name: "Community", href: SOCIAL_LINKS.twitter },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "#" },
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
            { name: "Contact", href: "#" },
        ],
    },
];


// ─── Testimonials ────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
    {
        name: "Sarah Chen",
        role: "CTO at TechFlow",
        content: "Deploy Chat transformed our customer support. We reduced response times by 80% in the first week. The RAG engine is incredibly accurate.",
        image: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        name: "Marcus Wright",
        role: "VP of Product at ScaleAI",
        content: "The easiest integration I've ever seen. We had a custom-trained chatbot live on our docs in less than 30 minutes. Absolute game changer.",
        image: "https://i.pravatar.cc/150?u=marcus",
    },
    {
        name: "Elena Rodriguez",
        role: "Founder of GrowthBox",
        content: "Being able to train on our own Notion docs and PDFs without any coding knowledge is what sets Deploy Chat apart. Our customers love it.",
        image: "https://i.pravatar.cc/150?u=elena",
    },
];

// ─── Dashboard Onboarding (DashboardOverview) ────────────────────────────────
export interface OnboardingStep {
    id: number;
    name: string;
    description: string;
    icon: React.ElementType;
    href: string;
    color: string;
    bgColor: string;
    borderColor: string;
    gradientFrom: string;
    btnText: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 1,
        name: "Upload Documents",
        description: "Connect your knowledge base. Upload PDFs, CSVs, Markdown, or text files for your AI to learn from.",
        icon: HiDocumentText,
        href: "/dashboard/documents",
        color: "text-primary",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/10",
        gradientFrom: "from-primary to-secondary",
        btnText: "Add Documents",
    },
    {
        id: 2,
        name: "Create Knowledge Base",
        description: "Organize synced data into logical collections to help your AI retrieve precise information.",
        icon: HiDatabase,
        href: "/dashboard/datasets",
        color: "text-primary",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/10",
        gradientFrom: "from-primary to-secondary",
        btnText: "Setup Knowledge",
    },
    {
        id: 3,
        name: "Build AI Assistants",
        description: "Define how your AI speaks and which knowledge collections it should prioritize.",
        icon: HiChatAlt2,
        href: "/dashboard/chatbots",
        color: "text-primary",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/10",
        gradientFrom: "from-primary to-secondary",
        btnText: "Create Assistant",
    },
    {
        id: 4,
        name: "Test & Launch",
        description: "Perfect your responses in the playground before deploying to your users.",
        icon: HiSparkles,
        href: "/dashboard/playground",
        color: "text-primary",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/10",
        gradientFrom: "from-primary to-secondary",
        btnText: "Try Playground",
    },
];

// ─── Dashboard Quick Actions ────────────────────────────────────────────────
export const QUICK_ACTIONS = [
    {
        label: "New AI Assistant",
        description: "Deploy a new intelligent agent",
        icon: HiChatAlt2,
        hoverBorder: "hover:border-primary/50 hover:bg-primary/5",
        iconBg: "bg-primary/5 text-primary",
        hoverText: "group-hover:text-primary",
        href: "/dashboard/chatbots",
    },
    {
        label: "Add Knowledge Source",
        description: "Upload PDF, CSV, Markdown or scrape URL",
        icon: HiDatabase,
        hoverBorder: "hover:border-primary/50 hover:bg-primary/5",
        iconBg: "bg-primary/5 text-primary",
        hoverText: "group-hover:text-primary",
        href: "/dashboard/documents",
    },
    {
        label: "Connect Data",
        description: "Fetch from Notion, Drive or Slack",
        icon: HiShare,
        hoverBorder: "hover:border-primary/50 hover:bg-primary/5",
        iconBg: "bg-primary/5 text-primary",
        hoverText: "group-hover:text-primary",
        href: "/dashboard/connectors",
    },
];

// ─── Sidebar Navigation (Sidebar) ───────────────────────────────────────────
export const SIDEBAR_MAIN_NAV = [
    { id: "home", label: "Overview", path: "/dashboard", icon: HiHome },
    { id: "connectors", label: "Connectors", path: "/dashboard/connectors", icon: HiShare },
    { id: "documents", label: "Source Files", path: "/dashboard/documents", icon: HiDocumentText },
    { id: "datasets", label: "Knowledge Base", path: "/dashboard/datasets", icon: HiDatabase },
    { id: "chatbots", label: "AI Assistants", path: "/dashboard/chatbots", icon: HiChatAlt2 },
    { id: "playground", label: "Playground", path: "/dashboard/playground", icon: HiSparkles },
    { id: "analytics", label: "Analytics", path: "/dashboard/analytics", icon: HiChartBar },
];

export const SIDEBAR_SECONDARY_NAV = [
    { id: "help", label: "Help & Support", path: "/dashboard/help", icon: HiQuestionMarkCircle },
];

export const SIDEBAR_SETTINGS_NAV = [
    { id: "general", label: "Profile", path: "/dashboard/settings?tab=general", icon: HiUser },
    { id: "team", label: "Team Members", path: "/dashboard/settings?tab=team", icon: HiUsers },
    { id: "billing", label: "Billing & Plans", path: "/dashboard/settings?tab=billing", icon: HiCreditCard },
    { id: "api-keys", label: "API Keys", path: "/dashboard/settings?tab=api-keys", icon: HiKey },
    { id: "notifications", label: "Notifications", icon: HiBell },
];

export const CONNECTORS_NAV = [
    { id: "notion", label: "Notion", icon: HiDatabase },
];

// ─── Embed Colors (EmbedModal) ──────────────────────────────────────────────
export const PRESET_COLORS = [
    { label: "Primary", value: "#262ef2" },
    { label: "Dark", value: "#201f32" },
    { label: "Muted", value: "#a1a1a1" },
    { label: "Border", value: "#e3e2e5" },
];
// ─── Drawer Item List Skeleton ──────────────────────────────────────────────────
export const TOOLTIP_STYLE_CLASSES = "bg-secondary text-white text-[10px] font-bold rounded-lg shadow-xl border border-white/10 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap";
export const TOOLTIP_ARROW_CLASSES = "bg-secondary border-white/10 rotate-45";

// ─── Plan Names ─────────────────────────────────────────────────────────────
export const PLANS = {
    FREE: "free",
    TRIAL: "trial",
    STARTER: "starter",
    PROFESSIONAL: "professional",
    ENTERPRISE: "enterprise",
};

// ─── Entity Statuses ────────────────────────────────────────────────────────
export const STATUS = {
    CREATING: "creating",
    FAILED: "failed",
    ACTIVE: "active",
};

// ─── Chat Roles ─────────────────────────────────────────────────────────────
export const ROLES = {
    USER: "user",
    ASSISTANT: "assistant",
};

// ─── Brand & Global Content ──────────────────────────────────────────────────
export const BRAND = {
    first: "DEPLOY",
    second: "CHAT",
};

export const PAGE_CONTENT = {
    hero: {
        badge: "Open Source AI Chatbot Platform",
        headlineStart: "Deploy an Agent",
        headlineEnd: "In Minutes",
        subtitle: "Train a chatbot on your own data, customize it to your brand, and embed it on your website with a single line of code.",
        ctaStandard: "Get Started Free",
    },
    features: {
        badge: "Features",
        headlineWait: "Everything you need to build",
        headlineHighlight: "Intelligent Chatbots",
        subtitle: "A complete suite of tools to create, deploy, and manage AI conversational agents — no complexity required.",
    },
    integration: {
        badge: "How it Works",
        headline: "From your data to a live AI assistant in less than 5 minutes.",
        subtitle: "A seamless pipeline from document ingestion to a fully functioning chat widget on your website.",
    },
    connectors: {
        badge: "Integrations",
        headlineWait: "Connect all your",
        headlineHighlight: "Knowledge Sources",
        subtitle: "Sync data from the tools your team already uses. Your AI stays up-to-date automatically as your documents change.",
    },
    pricing: {
        badge: "Pricing",
        headline: "Simple pricing that scales with you",
        subtitle: "No hidden fees. No surprise overages. Cancel any time.",
    },
    faq: {
        badge: "FAQ",
        headline: "Frequently Asked Questions",
        subtitle: "Everything you need to know before getting started.",
    },
    cta: {
        badge: "Get Started",
        headlineWait: "Ready to Build Your",
        headlineHighlight: "Intelligent Future?",
        subtitleStart: "Join 500+ developers and businesses scaling their support with",
        subtitleEnd: " Start your 14-day free trial today.",
        primaryBtn: "Get Started for Free",
        secondaryBtn: "Talk to Sales",
        footerText: "No credit card required · Instant setup · GPT-4o access",
    },
};

// ─── Component Specific Data ─────────────────────────────────────────────────
export const HERO_DATA_SOURCES = [
    { label: "PDF", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#ef4444" },
    { label: "Web", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", color: "#3b82f6" },
    { label: "Notion", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "#1a1a2e" },
    { label: "API", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", color: "#8b5cf6" },
    { label: "CSV", icon: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color: "#10b981" },
    { label: "Slack", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "#e11d48" },
];

export const HERO_CHAT_CONVERSATIONS = [
    {
        question: "How do I reset my password?",
        answer: "Go to Settings → Security → Reset Password. You'll receive an email with a reset link.",
    },
    {
        question: "What are your pricing plans?",
        answer: "We offer Free, Starter ($19/mo), Professional ($49/mo), and Enterprise plans.",
    },
    {
        question: "Do you support multiple languages?",
        answer: "Yes! Our AI supports 50+ languages with automatic translation and detection.",
    },
];

export const HERO_NODES_DATA = [
    { src: HERO_DATA_SOURCES[0], radius: 240, angle: -90 },
    { src: HERO_DATA_SOURCES[3], radius: 240, angle: 30 },
    { src: HERO_DATA_SOURCES[5], radius: 240, angle: 150 },
    { src: HERO_DATA_SOURCES[1], radius: 300, angle: -30 },
    { src: HERO_DATA_SOURCES[2], radius: 300, angle: 90 },
    { src: HERO_DATA_SOURCES[4], radius: 300, angle: 210 },
];

export const HERO_RING_DEFS = [
    { radius: 185, arcFraction: 0.06, duration: 25, direction: -1 },
    { radius: 240, arcFraction: 0.07, duration: 35, direction: 1 },
    { radius: 300, arcFraction: 0.05, duration: 40, direction: -1 },
];

export const INTEGRATION_ORBIT_ICONS = [
    { d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { d: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
    { d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" },
    { d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
    { d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
];

// ─── Connectors ─────────────────────────────────────────────────────────────
export const AVAILABLE_CONNECTORS = [
    {
        id: "notion",
        name: "Notion",
        description: "Sync pages and databases",
        icon: SiNotion,
        color: "text-secondary",
        bgColor: "bg-muted",
        status: "active"
    },
    {
        id: "google-drive",
        name: "Google Drive",
        description: "Fetch docs and folders",
        icon: SiGoogledrive,
        color: "text-primary",
        bgColor: "bg-primary/5",
        status: "coming-soon"
    },
    {
        id: "slack",
        name: "Slack",
        description: "Index channel history",
        icon: SiSlack,
        color: "text-primary",
        bgColor: "bg-primary/5",
        status: "coming-soon"
    },
    {
        id: "github",
        name: "GitHub",
        description: "Sync repos and READMEs",
        icon: SiGithub,
        color: "text-secondary",
        bgColor: "bg-muted",
        status: "coming-soon"
    },
    {
        id: "intercom",
        name: "Intercom",
        description: "Import help articles",
        icon: SiIntercom,
        color: "text-primary",
        bgColor: "bg-primary/5",
        status: "coming-soon"
    }
];

export const LLM_PROVIDERS = [
    { label: "OpenAI", value: "openai" },
    { label: "Anthropic", value: "anthropic" },
    { label: "Google Gemini", value: "google" },
];
