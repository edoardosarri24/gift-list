import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGiftItemInput, CreateGiftItemSchema, GiftItemDTO, GiftListDTO } from '@gift-list/shared';
import api from '../../lib/axios';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Trash2 } from 'lucide-react';

export const ManageListPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const queryClient = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);

    const { data: list, isLoading } = useQuery({
        queryKey: ['manage-list', slug],
        queryFn: async () => {
            const { data } = await api.get<GiftListDTO>(`/lists/${slug}/manage`);
            return data;
        },
    });

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateGiftItemInput>({
        resolver: zodResolver(CreateGiftItemSchema),
        defaultValues: { preference: 'MEDIUM' }
    });

    const addItemMutation = useMutation({
        mutationFn: (newItem: CreateGiftItemInput) => api.post(`/items/list/${list?.id}`, newItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manage-list', slug] });
            reset();
            setShowAddForm(false);
        }
    });

    const deleteItemMutation = useMutation({
        mutationFn: (itemId: string) => api.delete(`/items/${itemId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['manage-list', slug] });
        }
    });

    if (isLoading) return <div style={{ padding: '24px' }}>Loading...</div>;
    if (!list) return <div style={{ padding: '24px' }}>List not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--color-primary)' }}>
                    ← Back to Dashboard
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>{list.name}</h1>
                    <a href={`${window.location.origin}/lists/${list.slug}`} target="_blank" rel="noreferrer" style={{ color: 'gray', fontSize: '14px' }}>
                        Public Link: {window.location.origin}/lists/{list.slug}
                    </a>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : 'Add Item'}
                </Button>
            </div>

            {showAddForm && (
                <Card style={{ marginBottom: '32px' }}>
                    <h3>Add New Gift</h3>
                    <form onSubmit={handleSubmit((data) => addItemMutation.mutate(data))} style={{ marginTop: '16px' }}>
                        <Input label="Name" placeholder="e.g. Nintendo Switch" {...register('name')} error={errors.name?.message} />
                        <Input label="Description (Optional)" placeholder="Any specific details" {...register('description')} error={errors.description?.message} />
                        <Input label="URL (Optional)" placeholder="https://..." {...register('url')} error={errors.url?.message} />

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>Preference</label>
                            <select {...register('preference')} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <Button type="submit" isLoading={isSubmitting || addItemMutation.isPending}>Save Item</Button>
                    </form>
                </Card>
            )}

            <div>
                <h3>Items</h3>
                <p style={{ color: 'gray', marginBottom: '16px', fontSize: '14px' }}>Note: Claims are hidden to preserve the surprise.</p>

                {list.items.length === 0 ? (
                    <Card style={{ textAlign: 'center', padding: '32px' }}>
                        <p>No items added yet.</p>
                        <Button variant="outline" onClick={() => setShowAddForm(true)} style={{ marginTop: '16px' }}>Add your first item</Button>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {list.items.map(item => (
                            <Card key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{item.name} <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'gray' }}>({item.preference})</span></h4>
                                    {item.description && <p style={{ fontSize: '14px', marginTop: '4px' }}>{item.description}</p>}
                                    {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', wordBreak: 'break-all' }}>Link</a>}
                                </div>
                                <button
                                    onClick={() => { if (window.confirm('Are you sure?')) deleteItemMutation.mutate(item.id) }}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer' }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
