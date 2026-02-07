import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DatasetsState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DatasetsState = {
    items: [],
    status: 'idle',
    error: null,
};

const datasetsSlice = createSlice({
    name: 'datasets',
    initialState,
    reducers: {
        setDatasets: (state, action: PayloadAction<any[]>) => {
            state.items = action.payload;
        },
    },
});

export const { setDatasets } = datasetsSlice.actions;
export default datasetsSlice.reducer;
