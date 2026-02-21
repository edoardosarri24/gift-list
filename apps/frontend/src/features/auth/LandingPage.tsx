import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from './Auth.module.css';

export const LandingPage = () => {
    const { user, isLoading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    if (isLoading) return null; // or a full screen spinner
    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className={styles.landing}>
            <h1 className={styles.title}>Gift List</h1>
            <p className={styles.subtitle}>Crea la tua lista dei desideri perfetta e condividila facilmente, mantenendo l'effetto sorpresa.</p>

            {isLogin ? (
                <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
                <RegisterForm onToggle={() => setIsLogin(true)} />
            )}
        </div>
    );
};
