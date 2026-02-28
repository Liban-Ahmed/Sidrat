/**
 * toastStore — Minimal Zustand store for transient toast messages.
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastState {
    current: ToastItem | null;
    show: (message: string, type?: ToastType, duration?: number) => void;
    dismiss: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    current: null,
    show: (message, type = 'success', duration = 2500) =>
        set({ current: { message, type, duration } }),
    dismiss: () => set({ current: null }),
}));
