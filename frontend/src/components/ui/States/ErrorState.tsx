import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './States.module.css';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to Load Data',
  message,
  onRetry,
}) => {
  return (
    <div className={styles.stateContainer}>
      <AlertTriangle size={48} className={`${styles.icon} ${styles.errorIcon}`} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry Request
        </Button>
      )}
    </div>
  );
};
