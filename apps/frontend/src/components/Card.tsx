import { HTMLAttributes, FC } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export const Card: FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`${styles.card} ${className}`} {...props}>
            {children}
        </div>
    );
};
