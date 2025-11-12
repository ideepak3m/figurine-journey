import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('category', { ascending: true });

            if (error) {
                throw new Error(`Failed to fetch categories: ${error.message}`);
            }

            return data as Category[];
        },
        staleTime: 1000 * 60 * 10, // 10 minutes - categories don't change often
    });
};

// Get unique categories from assets (alternative approach if not using categories table)
export const useAssetCategories = () => {
    return useQuery({
        queryKey: ['asset-categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('assets')
                .select('category')
                .not('category', 'is', null)
                .eq('asset_status', 'inventory');

            if (error) {
                throw new Error(`Failed to fetch asset categories: ${error.message}`);
            }

            // Get unique categories
            const uniqueCategories = [...new Set(data.map((item: { category: string | null }) => item.category))].filter(Boolean);
            return uniqueCategories as string[];
        },
        staleTime: 1000 * 60 * 10,
    });
};
