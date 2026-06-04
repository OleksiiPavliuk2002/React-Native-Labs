import { Task } from '../models/Task';

export type SocketState = 'Disconnected' | 'Connecting' | 'Connected' | 'Reconnecting';
type MessageHandler = (task: Task) => void;

export class SocketManager {
  private socket: WebSocket | null = null;
  private state: SocketState = 'Disconnected';
  private handler: MessageHandler | null = null;
  private retries = 0;
  private maxRetries = 1;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  getState(): SocketState {
    return this.state;
  }

  connect(url: string): void {
    this.state = this.retries > 0 ? 'Reconnecting' : 'Connecting';
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.state = 'Connected';
      this.retries = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string);
        const task = Task.fromJSON(payload);
        this.handler?.(task);
      } catch {
        console.error('Failed to parse WebSocket message:', event.data);
      }
    };

    this.socket.onclose = () => {
      if (this.retries < this.maxRetries) {
        this.retries += 1;
        this.state = 'Reconnecting';
        this.reconnectTimeout = setTimeout(() => this.connect(url), 1000);
      } else {
        this.state = 'Disconnected';
      }
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.retries = this.maxRetries;
    this.socket?.close();
    this.socket = null;
    this.state = 'Disconnected';
  }

  send(message: unknown): void {
    if (this.state === 'Connected' && this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  onMessage(handler: MessageHandler): void {
    this.handler = handler;
  }
}

export class MockSocketManager {
  private timer: ReturnType<typeof setInterval> | null = null;
  private handler: MessageHandler | null = null;
  private state: SocketState = 'Disconnected';

  connect(): void {
    this.state = 'Connected';
    this.timer = setInterval(() => {
      const task = new Task(
        `ws-${Date.now()}`,
        'WS update',
        'Task pushed from mock websocket',
        2,
        false,
        new Date(),
        'p1'
      );
      this.handler?.(task);
    }, 4000);
  }

  disconnect(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.state = 'Disconnected';
  }

  send(_message: unknown): void {}

  onMessage(handler: MessageHandler): void {
    this.handler = handler;
  }

  getState(): SocketState {
    return this.state;
  }
}
