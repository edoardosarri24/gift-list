import { useLanguage } from '../i18n/LanguageContext';
import { Button } from './Button';

export const LanguageToggle = ({ absolute = false }: { absolute?: boolean }) => {
    const { language, setLanguage } = useLanguage();

    return (
        <Button
            variant="outline"
            onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
            style={{
                padding: '0 12px',
                minWidth: '40px',
                height: '36px',
                backgroundColor: 'var(--color-surface)',
                ...(absolute ? { position: 'absolute', top: '16px', right: '16px' } : {})
            }}
        >
            {language === 'it' ? 'EN' : 'IT'}
        </Button>
    );
};
