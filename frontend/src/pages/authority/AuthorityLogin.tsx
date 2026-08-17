import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { useAuth } from '../../features/auth/AuthContext';
import styles from './AuthorityLogin.module.css';

export const AuthorityLogin: React.FC = () => {
  const [email, setEmail] = useState('officer@traffic.gov.in');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, 'TRAFFIC_AUTHORITY');
    navigate('/authority/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Shield size={40} color="var(--color-primary)" />
          <h1 className={styles.title}>Authority Command Center</h1>
          <p className={styles.subtitle}>Restricted access for traffic controllers and administrators</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <Input
            label="Officer Email / Badge ID"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Security Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg">
            <Lock size={18} /> Authenticate Session
          </Button>
        </form>
      </div>
    </div>
  );
};
