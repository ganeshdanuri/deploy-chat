import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface Dataset {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

interface DatasetsState {
    items: Dataset[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DatasetsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchDatasets = createAsyncThunk('datasets/fetchDatasets', async () => {
    const response = await api.get('/api/datasets/');
    return response.data;
});

export const createDataset = createAsyncThunk(
    'datasets/createDataset',
    async (data: { name: string; document_ids: string[] }) => {
        const response = await api.post('/api/datasets/', data);
        return response.data;
    }
);

export const deleteDataset = createAsyncThunk(
    'datasets/deleteDataset',
    async (datasetId: string) => {
        await api.delete(`/api/datasets/${datasetId}`);
        return datasetId;
    }
);

const datasetsSlice = createSlice({
    name: 'datasets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDatasets.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDatasets.fulfilled, (state, action: PayloadAction<Dataset[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchDatasets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch datasets';
            })
            .addCase(createDataset.fulfilled, (state, action: PayloadAction<Dataset>) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteDataset.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export default datasetsSlice.reducer;
