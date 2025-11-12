export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            assets: {
                Row: {
                    id: string
                    user_id: string
                    filename: string
                    asset_type: string
                    asset_status: string
                    original_asset_status: string
                    category: string | null
                    title: string | null
                    description: string | null
                    price: number | null
                    asset_url: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    filename: string
                    asset_type: string
                    asset_status?: string
                    original_asset_status?: string
                    category?: string | null
                    title?: string | null
                    description?: string | null
                    price?: number | null
                    asset_url: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    filename?: string
                    asset_type?: string
                    asset_status?: string
                    original_asset_status?: string
                    category?: string | null
                    title?: string | null
                    description?: string | null
                    price?: number | null
                    asset_url?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    user_id: string
                    category: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            asset_categories: {
                Row: {
                    id: string
                    asset_id: string
                    category_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    asset_id: string
                    category_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    asset_id?: string
                    category_id?: string
                    created_at?: string
                }
            }
            user_profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: string
                    is_approved: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: string
                    is_approved?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: string
                    is_approved?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    shipping_address: string
                    postal_code: string
                    is_gta: boolean
                    subtotal: number
                    shipping_fee: number
                    tax: number
                    total: number
                    payment_status: string
                    payment_intent_id: string | null
                    order_status: string
                    confirmation_email_sent: boolean
                    confirmation_email_sent_at: string | null
                    admin_email_sent: boolean
                    admin_email_sent_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number?: string
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    shipping_address: string
                    postal_code?: string
                    is_gta?: boolean
                    subtotal: number
                    shipping_fee: number
                    tax: number
                    total: number
                    payment_status?: string
                    payment_intent_id?: string | null
                    order_status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string
                    shipping_address?: string
                    postal_code?: string
                    is_gta?: boolean
                    subtotal?: number
                    shipping_fee?: number
                    tax?: number
                    total?: number
                    payment_status?: string
                    payment_intent_id?: string | null
                    order_status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    asset_id: string | null
                    custom_order_id: string | null
                    item_type: string
                    title: string
                    description: string | null
                    price: number
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    asset_id?: string | null
                    custom_order_id?: string | null
                    item_type?: string
                    title: string
                    description?: string | null
                    price: number
                    quantity: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    asset_id?: string | null
                    custom_order_id?: string | null
                    item_type?: string
                    title?: string
                    description?: string | null
                    price?: number
                    quantity?: number
                    created_at?: string
                }
            }
            custom_orders: {
                Row: {
                    id: string
                    order_id: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    reference_asset_id: string | null
                    n8n_session_id: string | null
                    customer_notes: string | null
                    photo_urls: string[]
                    estimated_price: number
                    requirements_summary: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_id?: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    reference_asset_id?: string | null
                    n8n_session_id?: string | null
                    customer_notes?: string | null
                    photo_urls?: string[]
                    estimated_price: number
                    requirements_summary?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string | null
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string
                    reference_asset_id?: string | null
                    n8n_session_id?: string | null
                    customer_notes?: string | null
                    photo_urls?: string[]
                    estimated_price?: number
                    requirements_summary?: string | null
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_order_number: {
                Args: Record<string, never>
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
