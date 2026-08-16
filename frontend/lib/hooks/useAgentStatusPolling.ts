"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { refreshChatbots } from "@/lib/store/slices/chatbotsSlice";
import { STATUS } from "@/lib/constants";

const POLL_INTERVAL_MS = 3_000;
/** Stop polling after this long so a stuck backend job can't spin forever. */
const MAX_POLL_MS = 5 * 60_000;

/**
 * Refetches agents while any of them are still training.
 * Mount once (dashboard layout) — the interval only runs when there is
 * something to wait for, and clears itself the moment everything settles.
 */
export function useAgentStatusPolling() {
    const dispatch = useAppDispatch();
    const { items: chatbots } = useAppSelector((state) => state.chatbots);

    const isTraining = chatbots.some(
        (bot) => (bot.status || "").toLowerCase() === STATUS.CREATING
    );

    // Tracks when the current training run began, so MAX_POLL_MS is measured
    // from the start of the run rather than from every re-render.
    const startedAt = useRef<number | null>(null);

    useEffect(() => {
        if (!isTraining) {
            startedAt.current = null;
            return;
        }

        if (startedAt.current === null) startedAt.current = Date.now();

        const timer = setInterval(() => {
            if (startedAt.current && Date.now() - startedAt.current > MAX_POLL_MS) {
                clearInterval(timer);
                return;
            }
            dispatch(refreshChatbots());
        }, POLL_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [isTraining, dispatch]);

    return { isTraining };
}
