import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    type: 'standard' | 'custom';
    title: string;
    description?: string;
    price: number;
    quantity: number;
    imageUrl?: string;

    // For standard products
    assetId?: string;

    // For custom orders
    customOrderData?: {
        n8nSessionId?: string;
        photoUrls: string[];
        customerNotes?: string;
        requirementsSummary?: string;
    };
}

export interface ShippingInfo {
    postalCode: string;
    isGTA: boolean;
    shippingFee: number;
}

interface CartStore {
    items: CartItem[];
    shippingInfo: ShippingInfo | null;

    // Actions
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setShippingInfo: (info: ShippingInfo) => void;

    // Computed values
    getSubtotal: () => number;
    getTotal: () => number;
    getItemCount: () => number;
}

// GTA postal code prefixes (first 3 characters)
const GTA_POSTAL_CODE_PREFIXES = ['M', 'L4', 'L5', 'L6', 'L7', 'L9', 'N'];

// Helper function to check if postal code is in GTA
export const isGTAPostalCode = (postalCode: string): boolean => {
    const cleanCode = postalCode.trim().toUpperCase().replace(/\s/g, '');

    // Check first 3 characters
    const prefix3 = cleanCode.substring(0, 3);
    if (GTA_POSTAL_CODE_PREFIXES.includes(prefix3)) return true;

    // Check first 2 characters
    const prefix2 = cleanCode.substring(0, 2);
    if (GTA_POSTAL_CODE_PREFIXES.includes(prefix2)) return true;

    // Check first character
    const prefix1 = cleanCode.substring(0, 1);
    if (GTA_POSTAL_CODE_PREFIXES.includes(prefix1)) return true;

    return false;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            shippingInfo: null,

            addItem: (item) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.id === item.id && i.type === 'standard'
                    );

                    // If it's a standard product and already exists, update quantity
                    if (existingItemIndex !== -1 && item.type === 'standard') {
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += item.quantity;
                        return { items: newItems };
                    }

                    // Otherwise, add as new item (custom orders are always added as new)
                    return { items: [...state.items, item] };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                }));
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [], shippingInfo: null });
            },

            setShippingInfo: (info) => {
                set({ shippingInfo: info });
            },

            getSubtotal: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getTotal: () => {
                const state = get();
                const subtotal = state.getSubtotal();
                const shippingFee = state.shippingInfo?.shippingFee || 0;
                return subtotal + shippingFee;
            },

            getItemCount: () => {
                const state = get();
                return state.items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'figurine-cart-storage', // localStorage key
            partialize: (state) => ({ items: state.items }), // Only persist items, not shipping info
        }
    )
);
