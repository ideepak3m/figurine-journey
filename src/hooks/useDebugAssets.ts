import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useDebugAssets = () => {
    return useQuery({
        queryKey: ['debug-assets'],
        queryFn: async () => {
            // Get ALL assets without filtering
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .limit(5);

            if (error) {
                console.error('Debug query error:', error);
                throw error;
            }

            console.log('🔍 Debug: First 5 assets from database:', data);
            if (data && data.length > 0) {
                console.log('🔍 Debug: Asset statuses:', data.map((a: any) => a.asset_status));
                console.log('🔍 Debug: Categories:', data.map((a: any) => a.category));
            }

            return data;
        },
    });
};
