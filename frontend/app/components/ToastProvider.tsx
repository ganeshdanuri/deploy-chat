"use client";

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
                toastClassName="!rounded-xl !shadow-xl !border !font-sans !text-sm"
                className="!top-20"
            />
            <style jsx global>{`
                /* Base toast styles */
                .Toastify__toast {
                    font-family: var(--font-space-grotesk), sans-serif;
                    border-radius: 12px;
                    padding: 12px 16px;
                    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
                }

                .Toastify__toast-body {
                    font-weight: 500;
                    font-size: 13px;
                }

                .Toastify__close-button {
                    opacity: 0.6;
                }

                .Toastify__close-button:hover {
                    opacity: 1;
                }

                /* Success toast - Very light emerald */
                .Toastify__toast--success {
                    background: #ffffff;
                    border: 1px solid #d1fae5;
                    color: #065f46;
                }

                .Toastify__toast--success .Toastify__progress-bar {
                    background: linear-gradient(90deg, #10b981, #059669);
                }

                .Toastify__toast--success .Toastify__toast-icon svg {
                    fill: #10b981;
                }

                /* Error toast - Very light red */
                .Toastify__toast--error {
                    background: #ffffff;
                    border: 1px solid #fecaca;
                    color: #991b1b;
                }

                .Toastify__toast--error .Toastify__progress-bar {
                    background: linear-gradient(90deg, #ef4444, #dc2626);
                }

                .Toastify__toast--error .Toastify__toast-icon svg {
                    fill: #ef4444;
                }

                /* Warning toast - Very light amber */
                .Toastify__toast--warning {
                    background: #ffffff;
                    border: 1px solid #fde68a;
                    color: #92400e;
                }

                .Toastify__toast--warning .Toastify__progress-bar {
                    background: linear-gradient(90deg, #f59e0b, #d97706);
                }

                .Toastify__toast--warning .Toastify__toast-icon svg {
                    fill: #f59e0b;
                }

                /* Info toast - Very light indigo */
                .Toastify__toast--info {
                    background: #ffffff;
                    border: 1px solid #e0e7ff;
                    color: #3730a3;
                }

                .Toastify__toast--info .Toastify__progress-bar {
                    background: linear-gradient(90deg, #6366f1, #4f46e5);
                }

                .Toastify__toast--info .Toastify__toast-icon svg {
                    fill: #6366f1;
                }

                /* Default toast */
                .Toastify__toast--default {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    color: #1e293b;
                }

                .Toastify__toast--default .Toastify__progress-bar {
                    background: linear-gradient(90deg, #6366f1, #4f46e5);
                }
            `}</style>
        </>
    );
}
