import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Chatbot, AsyncSliceState } from '@/lib/types';

type ChatbotsState = AsyncSliceState<Chatbot>;

const initialState: ChatbotsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchChatbots = createAsyncThunk('chatbots/fetchChatbots', async () => {
    const response = await api.get(ENDPOINTS.CHATBOTS.BASE);
    return response.data as Chatbot[];
});

export const createChatbot = createAsyncThunk(
    'chatbots/createChatbot',
    async (data: {
        name: string;
        dataset_ids: string[];
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

const chatbotsSlice = createSlice({
    name: 'chatbots',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatbots.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchChatbots.fulfilled, (state, action: PayloadAction<Chatbot[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchChatbots.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch chatbots';
            })
            .addCase(createChatbot.fulfilled, (state, action: PayloadAction<Chatbot>) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteChatbot.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export default chatbotsSlice.reducer;
