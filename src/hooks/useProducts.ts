import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Asset = Database['public']['Tables']['assets']['Row'];

export interface Product extends Asset {
    // Add any computed or additional fields if needed
}

interface UseProductsOptions {
    category?: string;
    limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
    const { category, limit } = options;

    return useQuery({
        queryKey: ['products', { category, limit }],
        queryFn: async () => {
            console.log('🔍 Fetching products with options:', { category, limit });

            // First, let's check what's actually in the database
            const { data: allAssets, error: checkError } = await supabase
                .from('assets')
                .select('asset_status, category, title, asset_url')
                .limit(5);

            console.log('📊 First 5 assets in database:', allAssets);
            console.log('📊 Asset statuses found:', allAssets?.map((a: any) => a.asset_status));
            if (allAssets && allAssets.length > 0) {
                console.log('🖼️ Sample asset_url:', (allAssets[0] as any)?.asset_url);
                console.log('🖼️ Is it a full URL?', (allAssets[0] as any)?.asset_url?.startsWith('http'));
            }

            let query = supabase
                .from('assets')
                .select('*')
                // Show both inventory and sold items
                .in('asset_status', ['inventory', 'sold'])
                .order('created_at', { ascending: false });

            // Filter by category if provided
            if (category && category !== 'all') {
                query = query.eq('category', category);
            }

            // Apply limit if provided
            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) {
                console.error('❌ Error fetching products:', error);
                throw new Error(`Failed to fetch products: ${error.message}`);
            }

            console.log('✅ Products fetched:', data?.length || 0, 'items');
            console.log('📦 Sample product:', data?.[0]);

            return data as Product[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}; export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(`Failed to fetch product: ${error.message}`);
            }

            return data as Product;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};
