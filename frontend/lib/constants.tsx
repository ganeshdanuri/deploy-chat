import { theme } from "../app/theme";
import { HiGlobe, HiChartBar, HiUserGroup, HiShieldCheck } from "react-icons/hi";
import { FaBrain } from "react-icons/fa";
import { MdIntegrationInstructions } from "react-icons/md";

// From page.tsx
export const LANDING_STATS = [
    {
        id: 1,
        value: "98%",
        label: "Accuracy Rate",
        color: theme.colors.accent.green,
        bgColor: theme.colors.accent.greenLight,
    },
    {
        id: 2,
        value: "24/7",
        label: "Always Available",
        color: theme.colors.accent.yellow,
        bgColor: theme.colors.accent.yellowLight,
    },
    {
        id: 3,
        value: "10K+",
        label: "Active Users",
        color: theme.colors.accent.purple,
        bgColor: theme.colors.accent.purpleLight,
    },
];

// From FeaturesSection.tsx
export const PLATFORM_FEATURES = [
    {
        id: 1,
        title: "Easy Integration",
        description: "Add AI chatbots to your website with just a few lines of code. No complex setup required.",
        icon: MdIntegrationInstructions,
        color: theme.colors.primary.main,
        span: "col-span-1 md:col-span-2 lg:col-span-1",
    },
    {
        id: 2,
        title: "Custom Training",
        description: "Train your chatbot on your own content, documentation, and knowledge base for accurate responses.",
        icon: FaBrain,
        color: theme.colors.accent.purple,
        span: "col-span-1 md:col-span-2 lg:col-span-2",
    },
    {
        id: 3,
        title: "24/7 Support",
        description: "Your AI chatbot works around the clock to provide instant answers.",
        icon: HiGlobe,
        color: theme.colors.accent.green,
        span: "col-span-1",
    },
    {
        id: 4,
        title: "Analytics Dashboard",
        description: "Track conversations, user satisfaction, and chatbot performance.",
        icon: HiChartBar,
        color: theme.colors.accent.blue,
        span: "col-span-1",
    },
    {
        id: 5,
        title: "Multi-language",
        description: "Support customers in multiple languages with AI-powered translation.",
        icon: HiUserGroup,
        color: theme.colors.accent.yellow,
        span: "col-span-1 md:col-span-2 lg:col-span-1",
    },
    {
        id: 6,
        title: "Enterprise Security",
        description: "Bank-grade encryption and GDPR compliance out of the box.",
        icon: HiShieldCheck,
        color: theme.colors.accent.teal,
        span: "col-span-1 md:col-span-3 lg:col-span-3",
    },
];

// From PricingSection.tsx
export const PRICING_PLANS = [
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

// From FAQSection.tsx
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

// From TestimonialsSection.tsx
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
