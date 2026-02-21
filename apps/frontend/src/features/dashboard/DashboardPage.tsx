import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { GiftListDTO } from '@gift-list/shared';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
    const { user, logout } = useAuth();

    if (!user) return <Navigate to="/" replace />;

    const { data: lists, isLoading } = useQuery({
        queryKey: ['celebrant-lists'],
        queryFn: async () => {
            const { data } = await api.get<GiftListDTO[]>('/lists');
            return data;
        },
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1>My Gift Lists</h1>
                <Button onClick={logout} variant="outline">Sign Out</Button>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Link to="/dashboard/new" style={{ textDecoration: 'none' }}>
                    <Button variant="primary">Create New List</Button>
                </Link>
            </div>

            {isLoading ? (
                <div>Loading lists...</div>
            ) : lists && lists.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {lists.map(list => (
                        <Card key={list.id}>
                            <h3>{list.name}</h3>
                            <p style={{ marginTop: '8px', color: 'gray' }}>Items: {list.items.length}</p>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                <Link to={`/dashboard/${list.slug}`} style={{ flex: 1, textDecoration: 'none' }}>
                                    <Button variant="outline" style={{ width: '100%' }}>Manage</Button>
                                </Link>
                                <Link to={`/lists/${list.slug}`} target="_blank" style={{ flex: 1, textDecoration: 'none' }}>
                                    <Button variant="secondary" style={{ width: '100%' }}>View Public</Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <h3>No lists yet</h3>
                    <p style={{ color: 'gray', marginTop: '8px', marginBottom: '16px' }}>You haven't created any gift lists.</p>
                    <Link to="/dashboard/new" style={{ textDecoration: 'none' }}>
                        <Button variant="primary">Create your first list</Button>
                    </Link>
                </Card>
            )}
        </div>
    );
};
