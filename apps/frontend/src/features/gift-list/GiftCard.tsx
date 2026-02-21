import { FC } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { GiftItemDTO } from '@gift-list/shared';

interface GiftCardProps {
    item: GiftItemDTO;
    onClaim: (id: string) => void;
    onUnclaim: (id: string) => void;
    isLoading?: boolean;
}

export const GiftCard: FC<GiftCardProps> = ({ item, onClaim, onUnclaim, isLoading }) => {
    const isAvailable = item.status === 'AVAILABLE';
    const isClaimedByMe = item.isClaimedByMe;
    const isClaimedByOther = !isAvailable && !isClaimedByMe;

    return (
        <Card style={{
            opacity: isClaimedByOther ? 0.6 : 1,
            border: isClaimedByMe ? '2px solid var(--color-primary)' : '1px solid transparent',
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            transform: isClaimedByOther ? 'scale(0.98)' : 'scale(1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.3px' }}>
                        {item.name}
                        {isClaimedByMe && <span style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, padding: '4px 8px', backgroundColor: 'rgba(0, 122, 255, 0.1)', borderRadius: '12px' }}>Prenotato da te</span>}
                        {isClaimedByOther && <span style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500, padding: '4px 8px', backgroundColor: 'var(--color-bg)', borderRadius: '12px' }}>Già prenotato</span>}
                    </h4>
                    {item.description && <p style={{ fontSize: '15px', marginTop: '8px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{item.description}</p>}
                    {item.url && (
                        <div style={{ marginTop: '12px' }}>
                            <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                                Vedi Link ↗
                            </a>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', minWidth: '130px' }}>
                    {isAvailable && (
                        <Button onClick={() => onClaim(item.id)} isLoading={isLoading} size="sm">
                            Prenota
                        </Button>
                    )}
                    {isClaimedByMe && (
                        <Button variant="outline" onClick={() => onUnclaim(item.id)} isLoading={isLoading} size="sm">
                            Annulla
                        </Button>
                    )}
                    {isClaimedByOther && (
                        <Button disabled variant="ghost" size="sm">
                            Non Disponibile
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
