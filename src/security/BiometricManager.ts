import * as LocalAuthentication from 'expo-local-authentication';
import { storageService } from '../storage/StorageService';
import { UserProfile } from '../models/UserProfile';

export type BiometricType = 'FaceID' | 'TouchID' | 'Fingerprint' | 'None';
export type AuthState = 'Idle' | 'Authenticating' | 'Success' | 'Failed' | 'Unavailable';
export type AuthResult = { ok: boolean; state: AuthState; message?: string };

export class BiometricManager {
  private state: AuthState = 'Idle';
  private localAuth: {
    hasHardwareAsync?: () => Promise<boolean>;
    isEnrolledAsync?: () => Promise<boolean>;
    supportedAuthenticationTypesAsync?: () => Promise<number[]>;
    authenticateAsync?: (options: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
    AuthenticationType?: { FACIAL_RECOGNITION: number; FINGERPRINT: number };
  };

  constructor(localAuth?: BiometricManager['localAuth']) {
    this.localAuth =
      localAuth ??
      ((LocalAuthentication as unknown as { default?: unknown; hasHardwareAsync?: unknown }).hasHardwareAsync
        ? (LocalAuthentication as unknown as BiometricManager['localAuth'])
        : ((LocalAuthentication as unknown as { default?: BiometricManager['localAuth'] }).default ?? {}));
  }

  getState(): AuthState {
    return this.state;
  }

  async checkAvailability(): Promise<{ available: boolean; type: BiometricType }> {
    const hasHardware = (await this.localAuth.hasHardwareAsync?.()) ?? false;
    const isEnrolled = (await this.localAuth.isEnrolledAsync?.()) ?? false;
    if (!hasHardware || !isEnrolled) {
      this.state = 'Unavailable';
      return { available: false, type: 'None' };
    }

    const types = (await this.localAuth.supportedAuthenticationTypesAsync?.()) ?? [];
    const authType = this.localAuth.AuthenticationType;
    if (authType && types.includes(authType.FACIAL_RECOGNITION)) {
      return { available: true, type: 'FaceID' };
    }
    if (authType && types.includes(authType.FINGERPRINT)) {
      return { available: true, type: 'Fingerprint' };
    }
    return { available: true, type: 'TouchID' };
  }

  async authenticate(reason: string): Promise<AuthResult> {
    this.state = 'Authenticating';
    const available = await this.checkAvailability();
    if (!available.available) {
      return { ok: false, state: 'Unavailable', message: 'Biometric sensor unavailable' };
    }

    const result = await this.localAuth.authenticateAsync?.({
      promptMessage: reason,
      fallbackLabel: 'Use password',
      cancelLabel: 'Cancel',
    });

    if (result?.success) {
      this.state = 'Success';
      return { ok: true, state: 'Success' };
    }

    this.state = 'Failed';
    return { ok: false, state: 'Failed', message: result?.error ?? 'Authentication failed' };
  }

  async isEnabledByUser(): Promise<boolean> {
    const profile = await storageService.readProfile();
    return Boolean(profile?.biometricEnabled);
  }

  async setEnabledByUser(enabled: boolean): Promise<void> {
    const profile =
      (await storageService.readProfile()) ??
      new UserProfile('u1', 'Student', 'student@example.com', false, 20, new Date());
    profile.biometricEnabled = enabled;
    await storageService.saveProfile(profile);
  }
}

export class MockBiometricManager {
  private state: AuthState = 'Idle';
  private enabled = false;
  public nextResult: AuthResult = { ok: true, state: 'Success' };

  getState(): AuthState {
    return this.state;
  }

  async checkAvailability(): Promise<{ available: boolean; type: BiometricType }> {
    return { available: true, type: 'Fingerprint' };
  }

  async authenticate(_reason: string): Promise<AuthResult> {
    this.state = 'Authenticating';
    await Promise.resolve();
    this.state = this.nextResult.state;
    return this.nextResult;
  }

  async isEnabledByUser(): Promise<boolean> {
    return this.enabled;
  }

  async setEnabledByUser(enabled: boolean): Promise<void> {
    this.enabled = enabled;
  }
}

export const biometricManager = new BiometricManager();
