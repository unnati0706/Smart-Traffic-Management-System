import React from 'react';
import { Inbox } from 'lucide-react';
import styles from './States.module.css';

interface EmptyStateProps {
  title?: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description,
  action,
}) => {
  return (
    <div className={styles.stateContainer}>
      <Inbox size={48} className={styles.icon} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action}
    </div>
  );
};
