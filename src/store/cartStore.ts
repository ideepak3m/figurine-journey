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
    province?: string;
    taxRate?: number;
    isPickup?: boolean;
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
    getTax: () => number;
    getTotal: () => number;
    getItemCount: () => number;
}

// GTA postal code prefixes (first 3 characters)
const GTA_POSTAL_CODE_PREFIXES = ['M', 'L4', 'L5', 'L6', 'L7', 'L9', 'N'];

// Tax rates by province
export const TAX_RATES = {
    ON: 0.13, // HST - Ontario (includes GTA)
    QC: 0.14975, // GST 5% + QST 9.975%
    BC: 0.12, // GST 5% + PST 7%
    AB: 0.05, // GST only
    SK: 0.11, // GST 5% + PST 6%
    MB: 0.12, // GST 5% + PST 7%
    NS: 0.15, // HST
    NB: 0.15, // HST
    NL: 0.15, // HST
    PE: 0.15, // HST
    YT: 0.05, // GST only
    NT: 0.05, // GST only
    NU: 0.05, // GST only
};

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

// Helper function to determine province from postal code
export const getProvinceFromPostalCode = (postalCode: string): string => {
    const cleanCode = postalCode.trim().toUpperCase().replace(/\s/g, '');
    const firstChar = cleanCode.charAt(0);

    // Canadian postal code province mapping
    const provinceMap: { [key: string]: string } = {
        A: 'NL', // Newfoundland and Labrador
        B: 'NS', // Nova Scotia
        C: 'PE', // Prince Edward Island
        E: 'NB', // New Brunswick
        G: 'QC', // Quebec (Eastern)
        H: 'QC', // Quebec (Montreal)
        J: 'QC', // Quebec (Western)
        K: 'ON', // Ontario (Eastern)
        L: 'ON', // Ontario (Central)
        M: 'ON', // Ontario (Toronto)
        N: 'ON', // Ontario (Southwestern)
        P: 'ON', // Ontario (Northern)
        R: 'MB', // Manitoba
        S: 'SK', // Saskatchewan
        T: 'AB', // Alberta
        V: 'BC', // British Columbia
        X: 'NT', // Northwest Territories, Nunavut
        Y: 'YT', // Yukon
    };

    return provinceMap[firstChar] || 'ON'; // Default to Ontario
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

            getTax: () => {
                const state = get();
                const subtotal = state.getSubtotal();
                const shippingFee = state.shippingInfo?.shippingFee || 0;
                const taxRate = state.shippingInfo?.taxRate || TAX_RATES.ON; // Default to Ontario HST

                // Tax is calculated on subtotal + shipping
                return (subtotal + shippingFee) * taxRate;
            },

            getTotal: () => {
                const state = get();
                const subtotal = state.getSubtotal();
                const shippingFee = state.shippingInfo?.shippingFee || 0;
                const tax = state.getTax();
                return subtotal + shippingFee + tax;
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
