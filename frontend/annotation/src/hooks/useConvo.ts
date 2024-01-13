import { create } from "zustand";

export interface Message {
    parent?: string;
    children: string[];
    create_time: number;
    author: {
        role: string;
        name?: string;
        metadata?: any;
    },
    metadata: {
        model_slug?: string;
        edit_status?: string;
        original_content?: string;
        recipient?: string;
    }
    content?: string | number[] | {
        size: string;
        prompt?: string;
        prompts?: string[];
    };
}

export interface Convo {
    id: string;
    title: string;
    /** Unix timestamp as float */ 
    create_time: number;
    /** Yes, this is terrible. Will narrow this down */
    mapping: Record<string, Message>;
    metadata: {
        edit_status: string;
        platform: string;
        system_message?: string;
    }
    last_message: string;
}

type ConvoState = {
    convo?: Convo;
    readConvo: (id: string) => Promise<void>;
    updateMessage: (id: string, message: Message) => Promise<void>;
    saveMessage: (id: string, message: Message) => Promise<void>;
    saveConvo: (id: string, convo?: Convo) => Promise<void>;
};

export const useConvoStore = create<ConvoState>((set) => ({
    convo: undefined,
    readConvo: async (id) => {
        set({convo: undefined});
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/convos/dalle/${id}`);
        const data = await res.json();
        set({ convo: data }, false);
    },
    updateMessage: async (id, message) => {
        // Used for just updating local state. Let's hope this doesn't break anything
        const convo = await useConvoStore.getState().convo;
        if (convo) {
            const newConvo = { ...convo, mapping: { ...convo.mapping, [id]: message } };
            set({ convo: newConvo });
        }
    },
    saveMessage: async (id, message) => {
        const convo = await useConvoStore.getState().convo;
        if (convo) {
            const newConvo = { ...convo, mapping: { ...convo.mapping, [id]: message } };
            // PUT the convo onto the server
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/convos/dalle/${convo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newConvo)
            });
            if (res.ok) {
                set({ convo: newConvo });
            }
        }
    },
    saveConvo: async (id, convo) => {
        if (convo) {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/convos/dalle/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(convo)
            });
            const data = await res.json();
            if (res.ok) {
                set({ convo: data });
            } else {
                console.log(res.status, data);
            }
        }
    }
}));

