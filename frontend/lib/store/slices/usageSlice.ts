import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

interface UsageState {
    message_count: number;
    token_count: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    hasLoaded: boolean;
    error: string | null;
}

const initialState: UsageState = {
    message_count: 0,
    token_count: 0,
    status: 'idle',
    hasLoaded: false,
    error: null,
};

export const fetchUsageStats = createAsyncThunk('usage/fetchStats', async () => {
    const response = await api.get(ENDPOINTS.USAGE.STATS);
    return response.data;
});

const usageSlice = createSlice({
    name: 'usage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsageStats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsageStats.fulfilled, (state, action) => {
                state.hasLoaded = true;
                state.status = 'succeeded';
                state.message_count = action.payload.message_count || 0;
                state.token_count = action.payload.token_count || 0;
            })
            .addCase(fetchUsageStats.rejected, (state, action) => {
                state.hasLoaded = true;
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch usage stats';
            });
    },
});

export default usageSlice.reducer;
