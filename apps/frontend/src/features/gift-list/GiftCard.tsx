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
            border: isClaimedByMe ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>
                        {item.name}
                        {isClaimedByMe && <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--color-primary)', fontWeight: 'bold' }}>Claimed by You</span>}
                        {isClaimedByOther && <span style={{ marginLeft: '8px', fontSize: '12px', color: 'gray' }}>Already Claimed</span>}
                    </h4>
                    {item.description && <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--color-text)' }}>{item.description}</p>}
                    {item.url && (
                        <div style={{ marginTop: '8px' }}>
                            <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none' }}>
                                View Link
                            </a>
                        </div>
                    )}
                </div>

                <div style={{ marginLeft: '16px' }}>
                    {isAvailable && (
                        <Button onClick={() => onClaim(item.id)} isLoading={isLoading} size="sm">
                            Claim Gift
                        </Button>
                    )}
                    {isClaimedByMe && (
                        <Button variant="outline" onClick={() => onUnclaim(item.id)} isLoading={isLoading} size="sm">
                            Unclaim
                        </Button>
                    )}
                    {isClaimedByOther && (
                        <Button disabled variant="ghost" size="sm">
                            Unavailable
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
