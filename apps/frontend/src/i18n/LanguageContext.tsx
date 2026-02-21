import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'it' | 'en';

const translations = {
    it: {
        dashboardTitle: 'Le Mie Liste Regali',
        logout: 'Esci',
        createNewList: 'Crea Nuova Lista',
        loading: 'Caricamento liste...',
        giftsCount: 'Regali',
        manage: 'Gestisci',
        noListsTitle: 'Nessuna lista',
        noListsMsg: 'Non hai ancora creato nessuna lista regali.',
        createFirstList: 'Crea la tua prima lista',
        landingTitle: 'Gift List',
        landingSubtitle: "Crea la tua lista dei desideri perfetta e condividila facilmente, mantenendo l'effetto sorpresa.",
        welcomeBack: 'Bentornato',
        createAccount: 'Crea un account',
        loginButton: 'Accedi',
        registerButton: 'Registrati',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        nameLabel: 'Nome',
        noAccount: 'Non hai un account?',
        createOne: 'Creane uno',
        alreadyHaveAccount: 'Hai già un account?',
        loginNow: 'Accedi ora',
        languageIT: 'IT',
        languageEN: 'EN'
    },
    en: {
        dashboardTitle: 'My Gift Lists',
        logout: 'Logout',
        createNewList: 'Create New List',
        loading: 'Loading lists...',
        giftsCount: 'Gifts',
        manage: 'Manage',
        noListsTitle: 'No lists',
        noListsMsg: "You haven't created any gift lists yet.",
        createFirstList: 'Create your first list',
        landingTitle: 'Gift List',
        landingSubtitle: 'Create your perfect wishlist and share it easily, keeping the surprise effect.',
        welcomeBack: 'Welcome Back',
        createAccount: 'Create an Account',
        loginButton: 'Login',
        registerButton: 'Register',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        nameLabel: 'Name',
        noAccount: "Don't have an account?",
        createOne: 'Create one',
        alreadyHaveAccount: 'Already have an account?',
        loginNow: 'Login now',
        languageIT: 'IT',
        languageEN: 'EN'
    }
};

type Translations = typeof translations.it;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('appLanguage');
        if (saved === 'it' || saved === 'en') return saved;
        return navigator.language.startsWith('it') ? 'it' : 'en';
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const t = (key: keyof Translations) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
