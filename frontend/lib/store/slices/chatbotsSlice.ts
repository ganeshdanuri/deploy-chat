import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface Chatbot {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

interface ChatbotsState {
    items: Chatbot[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ChatbotsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchChatbots = createAsyncThunk('chatbots/fetchChatbots', async () => {
    const response = await api.get('/api/chatbots/');
    return response.data;
});

export const createChatbot = createAsyncThunk(
    'chatbots/createChatbot',
    async (data: { name: string; dataset_ids: string[] }) => {
        const response = await api.post('/api/chatbots/', data);
        return response.data;
    }
);

export const deleteChatbot = createAsyncThunk(
    'chatbots/deleteChatbot',
    async (chatbotId: string) => {
        await api.delete(`/api/chatbots/${chatbotId}`);
        return chatbotId;
    }
);

const chatbotsSlice = createSlice({
    name: 'chatbots',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatbots.pending, (state) => {
                state.status = 'loading';
            })
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
