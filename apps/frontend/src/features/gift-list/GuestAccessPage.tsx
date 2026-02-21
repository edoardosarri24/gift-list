import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GuestAccessInput, GuestAccessSchema } from '@gift-list/shared';
import api from '../../lib/axios';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const GuestAccessPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GuestAccessInput>({
        resolver: zodResolver(GuestAccessSchema),
        defaultValues: { language: navigator.language.split('-')[0] || 'en' }
    });

    const onSubmit = async (data: GuestAccessInput) => {
        setError('');
        try {
            await api.post(`/lists/${slug}/access`, data);
            // Reload or navigate to list to trigger the query with the new cookie
            window.location.href = `/lists/${slug}`;
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Access failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                <Card>
                    <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Access Gift List</h2>
                    <p style={{ textAlign: 'center', color: 'gray', marginBottom: '24px', fontSize: '14px' }}>
                        Please provide your email to view the gift list. This is only used to notify you if a claimed item is removed.
                    </p>

                    {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="guest@example.com"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                        <Input
                            type="hidden"
                            {...register('language')}
                        />
                        <Button type="submit" isLoading={isSubmitting} style={{ width: '100%' }}>
                            View List
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
