import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export interface Connector {
    id: string;
    name: string;
    type: string;
    config: any;
    status: string;
    last_sync_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ConnectorsState {
    items: Connector[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ConnectorsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchConnectors = createAsyncThunk('connectors/fetchConnectors', async () => {
    const response = await api.get(ENDPOINTS.CONNECTORS.BASE);
    return response.data;
});

export const createConnector = createAsyncThunk(
    'connectors/createConnector',
    async (data: { name: string; type: string; config: any }) => {
        const response = await api.post(ENDPOINTS.CONNECTORS.BASE, data);
        return response.data;
    }
);

export const syncConnector = createAsyncThunk(
    'connectors/syncConnector',
    async (id: string) => {
        const response = await api.post(ENDPOINTS.CONNECTORS.SYNC(id));
        return { id, data: response.data };
    }
);

export const deleteConnector = createAsyncThunk(
    'connectors/deleteConnector',
    async (id: string) => {
        await api.delete(ENDPOINTS.CONNECTORS.BY_ID(id));
        return id;
    }
);

const connectorsSlice = createSlice({
    name: 'connectors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchConnectors.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchConnectors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchConnectors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch connectors';
            })
            .addCase(createConnector.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteConnector.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default connectorsSlice.reducer;
