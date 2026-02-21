import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import type { Document, AsyncSliceState } from '@/lib/types';

type DocumentsState = AsyncSliceState<Document>;

const initialState: DocumentsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchDocuments = createAsyncThunk('documents/fetchDocuments', async () => {
    const response = await api.get('/api/documents/');
    return response.data as Document[];
});

export const uploadDocument = createAsyncThunk(
    'documents/uploadDocument',
    async (formData: FormData) => {
        const response = await api.post('/api/documents/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data as Document;
    }
);

export const deleteDocument = createAsyncThunk('documents/deleteDocument', async (id: string) => {
    await api.delete(`/api/documents/${id}`);
    return id;
});

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchDocuments.fulfilled, (state, action: PayloadAction<Document[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch documents';
            })
            .addCase(uploadDocument.fulfilled, (state, action: PayloadAction<Document>) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteDocument.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(doc => doc.id !== action.payload);
            });
    },
});

export default documentsSlice.reducer;
