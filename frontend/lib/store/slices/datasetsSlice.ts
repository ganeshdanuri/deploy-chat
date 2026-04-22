import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Dataset, AsyncSliceState } from '@/lib/types';

type DatasetsState = AsyncSliceState<Dataset>;

const initialState: DatasetsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchDatasets = createAsyncThunk('datasets/fetchDatasets', async () => {
    const response = await api.get(ENDPOINTS.DATASETS.BASE);
    return response.data as Dataset[];
});

export const createDataset = createAsyncThunk(
    'datasets/createDataset',
    async (data: { name: string; document_ids: string[] }) => {
        const response = await api.post(ENDPOINTS.DATASETS.BASE, data);
        return response.data as Dataset;
    }
);

export const deleteDataset = createAsyncThunk(
    'datasets/deleteDataset',
    async (datasetId: string) => {
        await api.delete(ENDPOINTS.DATASETS.BY_ID(datasetId));
        return datasetId;
    }
);

export const updateDataset = createAsyncThunk(
    'datasets/updateDataset',
    async ({ id, name, document_ids }: { id: string; name?: string; document_ids?: string[] }) => {
        const response = await api.patch(ENDPOINTS.DATASETS.BY_ID(id), { name, document_ids });
        return response.data as Dataset;
    }
);

const datasetsSlice = createSlice({
    name: 'datasets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDatasets.pending, (state) => { state.status = 'loading'; })
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
            })
            .addCase(updateDataset.fulfilled, (state, action: PayloadAction<Dataset>) => {
                const idx = state.items.findIndex(item => item.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            });
    },
});

export default datasetsSlice.reducer;
