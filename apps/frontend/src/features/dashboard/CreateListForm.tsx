import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateGiftListInput, CreateGiftListSchema } from '@gift-list/shared';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import api from '../../lib/axios';
import { useNavigate, Link } from 'react-router-dom';

export const CreateListForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateGiftListInput>({
        resolver: zodResolver(CreateGiftListSchema)
    });

    const onSubmit = async (data: CreateGiftListInput) => {
        setError('');
        try {
            const res = await api.post('/lists', data);
            navigate(`/dashboard/${res.data.slug}`);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create list');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '48px auto', padding: '0 24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--color-primary)' }}>
                    ← Torna alla Dashboard
                </Link>
            </div>
            <Card>
                <h2>Crea una Nuova Lista Regali</h2>
                <p style={{ color: 'gray', marginBottom: '24px' }}>Dai un nome alla tua lista (es. "Il mio 30° Compleanno", "Lista Nozze")</p>

                {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Nome Lista"
                        placeholder="es. Il mio fantastico compleanno"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" isLoading={isSubmitting}>
                            Crea Lista
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
