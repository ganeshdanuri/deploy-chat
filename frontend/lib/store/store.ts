import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from './slices/documentsSlice';
import datasetsReducer from './slices/datasetsSlice';
import chatbotsReducer from './slices/chatbotsSlice';

export const store = configureStore({
    reducer: {
        documents: documentsReducer,
        datasets: datasetsReducer,
        chatbots: chatbotsReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
