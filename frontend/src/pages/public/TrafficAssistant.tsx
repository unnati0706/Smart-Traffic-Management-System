import React, { useState } from 'react';
import { Bot, Send, Database } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { assistantService } from '../../services/api/assistant';
import { AssistantQueryResponse } from '../../types';
import styles from './TrafficAssistant.module.css';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  factors?: string[];
  sources?: string[];
  timestamp: string;
}

export const TrafficAssistant: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: 'Hello! I am your AI Traffic Assistant. Ask me about real-time junction flow, congestion reasons, or optimal routes.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response: AssistantQueryResponse = await assistantService.queryAssistant(queryText);
      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        factors: response.factors,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'Why is MG Road Junction congested?',
    'Which route has less traffic right now?',
    'Where is the nearest available parking lot?',
  ];

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        <Bot color="var(--color-primary)" size={24} />
        <div>
          <div className={styles.chatTitle}>AI Traffic Intelligence Assistant</div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Powered by Computer Vision & Real-time IoT Sensor Feeds
          </span>
        </div>
      </div>

      <div className={styles.messageArea}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === 'user' ? styles.userBubble : styles.assistantBubble}
          >
            <div className={styles.answerText}>{msg.text}</div>

            {msg.factors && msg.factors.length > 0 && (
              <div className={styles.factorBox}>
                <strong>Data Factors:</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  {msg.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {msg.sources && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Database size={12} /> {msg.sources.join(' • ')}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className={styles.assistantBubble}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Analyzing traffic telemetry database...</span>
          </div>
        )}
      </div>

      <div className={styles.suggestions}>
        {suggestions.map((s, idx) => (
          <button key={idx} className={styles.chip} onClick={() => handleSend(s)}>
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className={styles.inputForm}
      >
        <Input
          placeholder="Ask a question about live traffic or signal timings..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" disabled={isLoading}>
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};
