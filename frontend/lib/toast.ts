import { toast, ToastOptions, Id } from 'react-toastify';

// Default toast configuration for consistent styling
const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

// Toast utility functions with consistent styling
export const showToast = {
    success: (message: string, options?: ToastOptions): Id => {
        return toast.success(message, {
            ...defaultOptions,
            ...options,
        });
    },

    error: (message: string, options?: ToastOptions): Id => {
        return toast.error(message, {
            ...defaultOptions,
            autoClose: 5000, // Errors stay longer
            ...options,
        });
    },

    info: (message: string, options?: ToastOptions): Id => {
        return toast.info(message, {
            ...defaultOptions,
            ...options,
        });
    },

    warning: (message: string, options?: ToastOptions): Id => {
        return toast.warning(message, {
            ...defaultOptions,
            ...options,
        });
    },

    loading: (message: string, options?: ToastOptions): Id => {
        return toast.loading(message, {
            ...defaultOptions,
            autoClose: false,
            ...options,
        });
    },

    dismiss: (toastId?: Id): void => {
        toast.dismiss(toastId);
    },

    update: (toastId: Id, options: ToastOptions & { render?: string }): void => {
        toast.update(toastId, options);
    },

    // Promise-based toast for async operations
    promise: <T>(
        promise: Promise<T>,
        messages: {
            pending: string;
            success: string;
            error: string;
        },
        options?: ToastOptions
    ): Promise<T> => {
        return toast.promise(promise, messages, {
            ...defaultOptions,
            ...options,
        }) as Promise<T>;
    },
};

export default showToast;
