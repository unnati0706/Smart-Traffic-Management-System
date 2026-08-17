import { io, Socket } from 'socket.io-client';
import { ENV } from '../../config/env';

type EventCallback = (data: any) => void;

class SocketManager {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private isConnected: boolean = false;
  private statusListeners: Set<(connected: boolean) => void> = new Set();

  public connect(token?: string) {
    if (this.socket) return;

    this.socket = io(ENV.WS_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      auth: token ? { token } : undefined,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.notifyStatus(true);
      console.log('[WebSocket] Connected to traffic gateway');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.notifyStatus(false);
      console.log('[WebSocket] Disconnected from traffic gateway');
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[WebSocket] Connection error:', err.message);
      this.isConnected = false;
      this.notifyStatus(false);
    });

    // Wire up events registered prior to connection
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((cb) => {
        this.socket?.on(event, cb);
      });
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.notifyStatus(false);
    }
  }

  public subscribe(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    return () => {
      this.unsubscribe(event, callback);
    };
  }

  public unsubscribe(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  public onStatusChange(callback: (connected: boolean) => void) {
    this.statusListeners.add(callback);
    callback(this.isConnected);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private notifyStatus(connected: boolean) {
    this.statusListeners.forEach((cb) => cb(connected));
  }

  public getConnectedStatus(): boolean {
    return this.isConnected;
  }
}

export const socketManager = new SocketManager();
