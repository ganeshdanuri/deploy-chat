import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind conflict resolution.
 * Usage: cn("px-4", condition && "py-2", "rounded")
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
