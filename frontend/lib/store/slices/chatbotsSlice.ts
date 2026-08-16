import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Chatbot, AsyncSliceState } from '@/lib/types';

type ChatbotsState = AsyncSliceState<Chatbot>;

const initialState: ChatbotsState = {
    items: [],
    status: 'idle',
    hasLoaded: false,
    error: null,
};

export const fetchChatbots = createAsyncThunk('chatbots/fetchChatbots', async () => {
    const response = await api.get(ENDPOINTS.CHATBOTS.BASE);
    return response.data as Chatbot[];
});

/**
 * Same request as fetchChatbots, but deliberately never touches `status`.
 * Background pollers use this so a silent refresh can't make the UI look
 * like it's doing a cold page load.
 */
export const refreshChatbots = createAsyncThunk('chatbots/refreshChatbots', async () => {
    const response = await api.get(ENDPOINTS.CHATBOTS.BASE);
    return response.data as Chatbot[];
});

export const createChatbot = createAsyncThunk(
    'chatbots/createChatbot',
    async (data: {
        name: string;
        /** Existing collections to attach. */
        dataset_ids?: string[];
        /** Loose files — the API wraps these in a collection for you. */
        document_ids?: string[];
        welcome_message: string;
        primary_color?: string;
        allowed_domains: string;
    }) => {
        const response = await api.post(ENDPOINTS.CHATBOTS.BASE, data);
        return response.data as Chatbot;
    }
);

export const deleteChatbot = createAsyncThunk(
    'chatbots/deleteChatbot',
    async (chatbotId: string) => {
        await api.delete(ENDPOINTS.CHATBOTS.BY_ID(chatbotId));
        return chatbotId;
    }
);

/** Re-runs indexing for an agent that failed to train. */
export const resumeChatbot = createAsyncThunk(
    'chatbots/resumeChatbot',
    async (chatbotId: string) => {
        await api.post(ENDPOINTS.CHATBOTS.RESUME(chatbotId));
        return chatbotId;
    }
);

const chatbotsSlice = createSlice({
    name: 'chatbots',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatbots.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchChatbots.fulfilled, (state, action: PayloadAction<Chatbot[]>) => {
                state.hasLoaded = true;
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchChatbots.rejected, (state, action) => {
                state.hasLoaded = true;
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch chatbots';
            })
            // No .pending case on purpose — see refreshChatbots.
            .addCase(refreshChatbots.fulfilled, (state, action: PayloadAction<Chatbot[]>) => {
                state.items = action.payload;
            })
            .addCase(createChatbot.fulfilled, (state, action: PayloadAction<Chatbot>) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteChatbot.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            // Flip to "creating" immediately so the status poller picks it up
            // without waiting for the next refetch.
            .addCase(resumeChatbot.fulfilled, (state, action: PayloadAction<string>) => {
                const bot = state.items.find(item => item.id === action.payload);
                if (bot) bot.status = 'creating';
            });
    },
});

export default chatbotsSlice.reducer;
