import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatbotsState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ChatbotsState = {
    items: [],
    status: 'idle',
    error: null,
};

const chatbotsSlice = createSlice({
    name: 'chatbots',
    initialState,
    reducers: {
        setChatbots: (state, action: PayloadAction<any[]>) => {
            state.items = action.payload;
        },
    },
});

export const { setChatbots } = chatbotsSlice.actions;
export default chatbotsSlice.reducer;
