import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUserInput, RegisterUserSchema } from '@gift-list/shared';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

export const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterUserInput>({
        resolver: zodResolver(RegisterUserSchema)
    });

    const onSubmit = async (data: RegisterUserInput) => {
        setServerError('');
        try {
            const res = await api.post('/auth/register', data);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setServerError(err.response?.data?.error?.message || 'Registration failed');
        }
    };

    return (
        <div className={styles.formContainer}>
            <Card>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
                {serverError && <div className={styles.serverError}>{serverError}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="celebrant@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <Button type="submit" isLoading={isSubmitting} style={{ width: '100%' }}>
                        Sign Up
                    </Button>
                </form>

                <div className={styles.toggle}>
                    Already have an account?
                    <button className={styles.toggleLink} onClick={onToggle}>Sign in</button>
                </div>
            </Card>
        </div>
    );
};
