"use client";

import { Toaster } from 'sonner';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                theme="light"
                toastOptions={{
                    className: "font-sans",
                    style: {
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                    },
                }}
            />
        </>
    );
}
