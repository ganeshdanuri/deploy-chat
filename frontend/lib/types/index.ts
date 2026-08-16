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
    /** `config` is intentionally absent — it holds the provider access token
     *  and is never sent to clients. Use synced_item_count instead. */
    synced_item_count: number;
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
    /** "creating" | "active" | "failed" — see STATUS in lib/constants. */
    status: string;
    chunk_count: number;
    /** Platform-wide today; served by the API so the UI can't drift from it. */
    model: string;
    allowed_domains?: string;
}

// ─── Redux Slice State ────────────────────────────────────────────────────────

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncSliceState<T> {
    items: T[];
    status: LoadingStatus;
    /**
     * True once this slice has completed a fetch, and never reset.
     * `status` alone can't distinguish a cold load from a background refresh —
     * gate first-paint skeletons on this instead, or a mid-session refetch will
     * blow away whatever the user is doing.
     */
    hasLoaded: boolean;
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
