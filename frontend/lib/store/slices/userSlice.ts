import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface UserMe {
    profile: {
        id: string;
        username: string;
        email: string;
        role: string | null;
        created_at: string;
    };
    billing: {
        current_plan: string;
        monthly_limit: number;
        plan_status: string;
        started_at: string;
        expires_at: string | null;
    };
    usage: {
        messages_sent: number;
        tokens_consumed: number;
        reset_date: string | null;
    };
}

interface UserState {
    data: UserMe | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchUserMe = createAsyncThunk('user/fetchMe', async () => {
    const response = await api.get('/api/users/me');
    return response.data;
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserData: (state) => {
            state.data = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserMe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserMe.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchUserMe.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch user data';
            });
    },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
