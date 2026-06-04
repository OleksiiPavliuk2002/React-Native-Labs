const mockLocalAuth = {
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  supportedAuthenticationTypesAsync: jest.fn(),
  authenticateAsync: jest.fn(),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
  },
};

jest.mock('expo-local-authentication', () => ({
  __esModule: true,
  ...mockLocalAuth,
}));

const mockStore = new Map<string, string>();
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async (key: string, value: string) => mockStore.set(key, value)),
  getItem: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  removeItem: jest.fn(async (key: string) => mockStore.delete(key)),
}));

import { BiometricManager, MockBiometricManager } from '../src/security/BiometricManager';
import { storageService } from '../src/storage/StorageService';
import { UserProfile } from '../src/models/UserProfile';

describe('BiometricManager', () => {
  let manager: BiometricManager;

  beforeEach(() => {
    manager = new BiometricManager(mockLocalAuth as any);
    mockStore.clear();
    mockLocalAuth.hasHardwareAsync.mockReset();
    mockLocalAuth.isEnrolledAsync.mockReset();
    mockLocalAuth.supportedAuthenticationTypesAsync.mockReset();
    mockLocalAuth.authenticateAsync.mockReset();
  });

  test('checkAvailability returns unavailable without hardware', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(false);
    const result = await manager.checkAvailability();
    expect(result.available).toBe(false);
    expect(result.type).toBe('None');
  });

  test('checkAvailability returns fingerprint type', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([1]);
    const result = await manager.checkAvailability();
    expect(result.type).toBe('Fingerprint');
  });

  test('checkAvailability returns face id type', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([2]);
    const result = await manager.checkAvailability();
    expect(result.type).toBe('FaceID');
  });

  test('authenticate success flow', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([1]);
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: true });
    const result = await manager.authenticate('Reason');
    expect(result.ok).toBe(true);
    expect(manager.getState()).toBe('Success');
  });

  test('authenticate failed flow by cancel', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([1]);
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: false, error: 'user_cancel' });
    const result = await manager.authenticate('Reason');
    expect(result.ok).toBe(false);
    expect(manager.getState()).toBe('Failed');
  });

  test('authenticate unavailable path', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(false);
    const result = await manager.authenticate('Reason');
    expect(result.state).toBe('Unavailable');
    expect(manager.getState()).toBe('Unavailable');
  });

  test('isEnabledByUser reads false by default', async () => {
    expect(await manager.isEnabledByUser()).toBe(false);
  });

  test('setEnabledByUser true and reads after restart', async () => {
    await manager.setEnabledByUser(true);
    const newManager = new BiometricManager(mockLocalAuth as any);
    expect(await newManager.isEnabledByUser()).toBe(true);
  });

  test('settings persistence has no distortion', async () => {
    const profile = new UserProfile('u1', 'Alex', 'alex@example.com', true, 42, new Date('2026-01-01T00:00:00.000Z'));
    await storageService.saveProfile(profile);
    const loaded = await storageService.readProfile();
    expect(loaded?.lockTimeoutSec).toBe(42);
    expect(loaded?.email).toBe('alex@example.com');
  });

  test('state becomes authenticating during auth', async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([1]);
    mockLocalAuth.authenticateAsync.mockImplementation(async () => {
      expect(manager.getState()).toBe('Authenticating');
      return { success: true };
    });
    await manager.authenticate('Reason');
  });
});

describe('MockBiometricManager', () => {
  test('mock can simulate success', async () => {
    const mock = new MockBiometricManager();
    mock.nextResult = { ok: true, state: 'Success' };
    const result = await mock.authenticate('x');
    expect(result.state).toBe('Success');
  });

  test('mock can simulate failure', async () => {
    const mock = new MockBiometricManager();
    mock.nextResult = { ok: false, state: 'Failed', message: 'cancel' };
    const result = await mock.authenticate('x');
    expect(result.state).toBe('Failed');
  });

  test('mock toggle enabled state', async () => {
    const mock = new MockBiometricManager();
    await mock.setEnabledByUser(true);
    expect(await mock.isEnabledByUser()).toBe(true);
  });
});
