import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginUserInput, LoginUserSchema } from '@gift-list/shared';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import api from '../../lib/axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

export const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginUserInput>({
        resolver: zodResolver(LoginUserSchema)
    });

    const onSubmit = async (data: LoginUserInput) => {
        setServerError('');
        try {
            const res = await api.post('/auth/login', data);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            if (err.response) {
                const status = err.response.status;
                const message = err.response.data?.error?.message;

                if (status === 401) {
                    setServerError('Credenziali non valide. Controlla email e password.');
                } else if (status >= 400 && status < 500) {
                    setServerError(message || 'Dati non validi. Riprova.');
                } else {
                    setServerError('Il server ha riscontrato un problema. Riprova più tardi.');
                }
            } else if (err.request) {
                setServerError('Impossibile contattare il server. Controlla la tua connessione.');
            } else {
                setServerError('Si è verificato un errore imprevisto. Riprova.');
            }
        }
    };

    return (
        <div className={styles.formContainer}>
            <Card>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Welcome Back</h2>
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
                        Sign In
                    </Button>
                </form>

                <div className={styles.toggle}>
                    Don't have an account?
                    <button className={styles.toggleLink} onClick={onToggle}>Create one</button>
                </div>
            </Card>
        </div>
    );
};
