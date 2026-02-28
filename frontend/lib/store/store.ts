import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from './slices/documentsSlice';
import usageReducer from './slices/usageSlice';
import datasetsReducer from './slices/datasetsSlice';
import chatbotsReducer from './slices/chatbotsSlice';
import userReducer from './slices/userSlice';
import connectorsReducer from './slices/connectorsSlice';

export const store = configureStore({
    reducer: {
        documents: documentsReducer,
        datasets: datasetsReducer,
        chatbots: chatbotsReducer,
        usage: usageReducer,
        user: userReducer,
        connectors: connectorsReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
