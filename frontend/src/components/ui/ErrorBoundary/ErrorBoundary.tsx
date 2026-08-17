import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] React Component Error Captured:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <AlertOctagon size={48} className={styles.icon} />
            <h1 className={styles.title}>System Exception Encountered</h1>
            <p className={styles.message}>
              The application encountered an unhandled runtime error. The command center telemetry engine isolated the issue.
            </p>
            {this.state.error && (
              <div className={styles.details}>
                {this.state.error.toString()}
              </div>
            )}
            <Button variant="primary" onClick={this.handleReload}>
              <RotateCcw size={16} /> Reload Command Center Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
