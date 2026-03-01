import { theme } from "../app/theme";
import {
    HiGlobe, HiChartBar, HiUserGroup, HiShieldCheck, HiDatabase,
    HiLightningBolt, HiColorSwatch, HiCode, HiSparkles, HiDocumentText,
    HiCursorClick, HiChatAlt2, HiHome, HiQuestionMarkCircle, HiUser,
    HiUsers, HiCreditCard, HiKey, HiBell, HiShare
} from "react-icons/hi";
import { FaBrain } from "react-icons/fa";
import { MdIntegrationInstructions } from "react-icons/md";

// ─── Landing Page Stats (HeroSection) ────────────────────────────────────────
export const LANDING_STATS = [
    {
        id: 1,
        value: "98%",
        label: "Accuracy Rate",
        color: "#262ef2",
        bgColor: "#262ef215",
    },
    {
        id: 2,
        value: "24/7",
        label: "Always Available",
        color: "#262ef2",
        bgColor: "#262ef215",
    },
    {
        id: 3,
        value: "10K+",
        label: "Active Users",
        color: "#262ef2",
        bgColor: "#262ef215",
    },
];

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
        color: "text-[#262ef2]",
        bgColor: "bg-[#262ef2]/5",
        borderColor: "border-[#262ef2]/10",
        gradientFrom: "from-[#262ef2] to-[#201f32]",
        btnText: "Add Documents",
    },
    {
        id: 2,
        name: "Create Knowledge Base",
        description: "Organize synced data into logical collections to help your AI retrieve precise information.",
        icon: HiDatabase,
        href: "/dashboard/datasets",
        color: "text-[#262ef2]",
        bgColor: "bg-[#262ef2]/5",
        borderColor: "border-[#262ef2]/10",
        gradientFrom: "from-[#262ef2] to-[#201f32]",
        btnText: "Setup Knowledge",
    },
    {
        id: 3,
        name: "Build AI Assistants",
        description: "Define how your AI speaks and which knowledge collections it should prioritize.",
        icon: HiChatAlt2,
        href: "/dashboard/chatbots",
        color: "text-[#262ef2]",
        bgColor: "bg-[#262ef2]/5",
        borderColor: "border-[#262ef2]/10",
        gradientFrom: "from-[#262ef2] to-[#201f32]",
        btnText: "Create Assistant",
    },
    {
        id: 4,
        name: "Test & Launch",
        description: "Perfect your responses in the playground before deploying to your users.",
        icon: HiSparkles,
        href: "/dashboard/playground",
        color: "text-[#262ef2]",
        bgColor: "bg-[#262ef2]/5",
        borderColor: "border-[#262ef2]/10",
        gradientFrom: "from-[#262ef2] to-[#201f32]",
        btnText: "Try Playground",
    },
];

// ─── Dashboard Quick Actions ────────────────────────────────────────────────
export const QUICK_ACTIONS = [
    {
        label: "New AI Assistant",
        description: "Deploy a new intelligent agent",
        icon: HiChatAlt2,
        hoverBorder: "hover:border-[#262ef2]/50 hover:bg-[#262ef2]/5",
        iconBg: "bg-[#262ef2]/5 text-[#262ef2]",
        hoverText: "group-hover:text-[#262ef2]",
        href: "/dashboard/chatbots",
    },
    {
        label: "Add Knowledge Source",
        description: "Upload PDF, CSV, Markdown or scrape URL",
        icon: HiDatabase,
        hoverBorder: "hover:border-[#262ef2]/50 hover:bg-[#262ef2]/5",
        iconBg: "bg-[#262ef2]/5 text-[#262ef2]",
        hoverText: "group-hover:text-[#262ef2]",
        href: "/dashboard/documents",
    },
    {
        label: "Connect Data",
        description: "Fetch from Notion, Drive or Slack",
        icon: HiShare,
        hoverBorder: "hover:border-[#262ef2]/50 hover:bg-[#262ef2]/5",
        iconBg: "bg-[#262ef2]/5 text-[#262ef2]",
        hoverText: "group-hover:text-[#262ef2]",
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
    { label: "Border", value: "#e3e3e3" },
];
// ─── Drawer Item List Skeleton ──────────────────────────────────────────────────
export const TOOLTIP_STYLE_CLASSES = "bg-[#201f32] text-white text-[10px] font-bold rounded-lg shadow-xl border border-white/10 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap";
export const TOOLTIP_ARROW_CLASSES = "bg-[#201f32] border-white/10 rotate-45";

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
