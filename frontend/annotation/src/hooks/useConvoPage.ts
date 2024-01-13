import { create } from 'zustand'
import { Convo } from './useConvo';

type ConvoPageState = {
    convos: Convo[];
    currentPage?: number;
    fetchPage: (page: number) => Promise<void>;
};

export const useConvoPageStore = create<ConvoPageState>((set) => ({
    convos: [],
    currentPage: 1,
    fetchPage: async (page) => {
        // Will hard code this if I ever need to use this again
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/convos/dalle/?page=${page}&limit=20`);
        const data = await res.json();
        set({ convos: data, currentPage: page });
    },
}));