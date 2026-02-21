// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Document {
    id: string;
    name: string;
    created_at: string;
    user_id: string;
}

export interface Dataset {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

export interface Chatbot {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    system_prompt: string;
    temperature: number;
}

// ─── Redux Slice State ────────────────────────────────────────────────────────

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncSliceState<T> {
    items: T[];
    status: LoadingStatus;
    error: string | null;
}

// ─── Usage Stats ──────────────────────────────────────────────────────────────

export interface UsageStats {
    message_count: number;
    token_count: number;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: number;
    text: string;
    isBot: boolean;
    isThinking?: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
    username: string;
    plan: string;
}
