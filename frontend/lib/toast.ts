import { toast } from 'sonner';

// Toast utility functions with consistent styling using Sonner
export const showToast = {
    success: (message: string) => {
        return toast.success(message);
    },

    error: (message: string) => {
        return toast.error(message);
    },

    info: (message: string) => {
        return toast.info(message);
    },

    warning: (message: string) => {
        return toast.warning(message);
    },

    loading: (message: string) => {
        return toast.loading(message);
    },

    dismiss: (id?: string | number) => {
        toast.dismiss(id);
    },

    // Promise-based toast for async operations
    promise: <T>(
        promise: Promise<T> | (() => Promise<T>),
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ): Promise<T> | any => {
        return toast.promise(promise, messages);
    },
};

export default showToast;
