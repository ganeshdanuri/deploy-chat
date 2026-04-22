// ─── Domain Models ───────────────────────────────────────────────────────────

export interface Document {
    id: string;
    name: string;
    connector_id?: string | null;
    external_id?: string | null;
    created_at: string;
    user_id: string;
}

export interface Connector {
    id: string;
    name: string;
    type: string;
    config: Record<string, unknown>;
    status: string;
    last_sync_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Dataset {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    document_ids?: string[];
    document_count?: number;
}

export interface Chatbot {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    system_prompt: string;
    temperature: number;
    embed_token: string;
    welcome_message: string;
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
