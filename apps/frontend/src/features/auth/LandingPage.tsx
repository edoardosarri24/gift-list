import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageToggle } from '../../components/LanguageToggle';

export const LandingPage = () => {
    const { user, isLoading } = useAuth();
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);

    if (isLoading) return null; // or a full screen spinner
    if (user) return <Navigate to="/dashboard" replace />;

    return (
        <div className={styles.landing}>
            <LanguageToggle absolute />
            <h1 className={styles.title}>{t('landingTitle')}</h1>
            <p className={styles.subtitle}>{t('landingSubtitle')}</p>

            {isLogin ? (
                <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
                <RegisterForm onToggle={() => setIsLogin(true)} />
            )}
        </div>
    );
};
