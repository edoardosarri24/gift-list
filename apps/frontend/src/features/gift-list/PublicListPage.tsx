import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { GiftListDTO } from '@gift-list/shared';
import { GiftCard } from './GiftCard';
import { GuestAccessPage } from './GuestAccessPage';

export const PublicListPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const queryClient = useQueryClient();
    const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

    const { data: list, isLoading, error } = useQuery({
        queryKey: ['public-list', slug],
        queryFn: async () => {
            const { data } = await api.get<GiftListDTO>(`/lists/${slug}`);
            return data;
        },
        retry: false
    });

    const claimMutation = useMutation({
        mutationFn: (itemId: string) => api.post(`/items/${itemId}/claim`),
        onMutate: (itemId: string) => setLoadingItemId(itemId),
        onSettled: () => {
            setLoadingItemId(null);
            queryClient.invalidateQueries({ queryKey: ['public-list', slug] });
        }
    });

    const unclaimMutation = useMutation({
        mutationFn: (itemId: string) => api.post(`/items/${itemId}/unclaim`),
        onMutate: (itemId: string) => setLoadingItemId(itemId),
        onSettled: () => {
            setLoadingItemId(null);
            queryClient.invalidateQueries({ queryKey: ['public-list', slug] });
        }
    });

    if (isLoading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading List...</div>;

    // If unauthorized, guest doesn't have a session, show Access page
    if (error && (error as any).response?.status === 401) {
        return <GuestAccessPage />;
    }

    if (!list) return <div style={{ padding: '48px', textAlign: 'center' }}>List not found.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>{list.name}</h1>
                <p style={{ color: 'gray', marginTop: '8px' }}>Select an item to claim it as your gift.</p>
            </div>

            {list.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', background: 'var(--color-surface)', borderRadius: '8px' }}>
                    No items have been added to this list yet. Check back later!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {list.items.map((item: any) => (
                        <GiftCard
                            key={item.id}
                            item={item}
                            onClaim={(id: string) => claimMutation.mutate(id)}
                            onUnclaim={(id: string) => unclaimMutation.mutate(id)}
                            isLoading={loadingItemId === item.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
