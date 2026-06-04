export class UserProfile {
  constructor(
    public id: string, 
    public fullName: string, 
    public email: string, 
    public biometricEnabled: boolean, 
    public lockTimeoutSec: number, 
    public lastLoginAt: Date 
  ) {}

  static fromJSON(json: UserProfileJSON): UserProfile {
    return new UserProfile(
      json.id,
      json.fullName,
      json.email,
      json.biometricEnabled,
      json.lockTimeoutSec,
      new Date(json.lastLoginAt)
    );
  }

  toJSON(): UserProfileJSON {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      biometricEnabled: this.biometricEnabled,
      lockTimeoutSec: this.lockTimeoutSec,
      lastLoginAt: this.lastLoginAt.toISOString(),
    };
  }
}

export type UserProfileJSON = {
  id: string;
  fullName: string;
  email: string;
  biometricEnabled: boolean;
  lockTimeoutSec: number;
  lastLoginAt: string;
};
