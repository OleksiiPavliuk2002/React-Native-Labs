import { MockSocketManager, SocketManager } from '../src/realtime/SocketManager';

class WSStub {
  public onopen: (() => void) | null = null;
  public onmessage: ((event: { data: string }) => void) | null = null;
  public onclose: (() => void) | null = null;
  public onerror: (() => void) | null = null;
  public sent: string[] = [];
  constructor(public url: string) {}
  send(data: string) {
    this.sent.push(data);
  }
  close() {
    this.onclose?.();
  }
}

describe('SocketManager', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    (globalThis as any).WebSocket = WSStub;
  });

  test('connect sets connecting state', () => {
    const manager = new SocketManager();
    manager.connect('ws://test');
    expect(manager.getState()).toBe('Connecting');
  });

  test('open sets connected state', () => {
    const manager = new SocketManager();
    manager.connect('ws://test');
    const ws = (manager as unknown as { socket: WSStub }).socket;
    ws?.onopen?.();
    expect(manager.getState()).toBe('Connected');
  });

  test('onMessage receives parsed task', () => {
    const manager = new SocketManager();
    const handler = jest.fn();
    manager.onMessage(handler);
    manager.connect('ws://test');
    const ws = (manager as unknown as { socket: WSStub }).socket;
    ws?.onmessage?.({
      data: JSON.stringify({
        id: 't1',
        title: 'A',
        description: 'B',
        priority: 1,
        isCompleted: false,
        dueDate: new Date().toISOString(),
        projectId: 'p1',
      }),
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('malformed message is ignored', () => {
    const manager = new SocketManager();
    const handler = jest.fn();
    manager.onMessage(handler);
    manager.connect('ws://test');
    const ws = (manager as unknown as { socket: WSStub }).socket;
    ws?.onmessage?.({ data: '{bad json' });
    expect(handler).not.toHaveBeenCalled();
  });

  test('send pushes message when connected', () => {
    const manager = new SocketManager();
    manager.connect('ws://test');
    const ws = (manager as unknown as { socket: WSStub }).socket;
    ws?.onopen?.();
    manager.send({ x: 1 });
    expect(ws?.sent).toHaveLength(1);
  });

  test('close triggers reconnect first time', () => {
    const manager = new SocketManager();
    manager.connect('ws://test');
    const ws = (manager as unknown as { socket: WSStub }).socket;
    ws?.onclose?.();
    expect(manager.getState()).toBe('Reconnecting');
  });

  test('disconnect sets disconnected', () => {
    const manager = new SocketManager();
    manager.connect('ws://test');
    manager.disconnect();
    expect(manager.getState()).toBe('Disconnected');
  });
});

describe('MockSocketManager', () => {
  test('connect starts connected state', () => {
    const mock = new MockSocketManager();
    mock.connect();
    expect(mock.getState()).toBe('Connected');
    mock.disconnect();
  });

  test('emits message on interval', () => {
    const mock = new MockSocketManager();
    const handler = jest.fn();
    mock.onMessage(handler);
    mock.connect();
    jest.advanceTimersByTime(4000);
    expect(handler).toHaveBeenCalled();
    mock.disconnect();
  });
});
