export type MotorTotClientRole = 'motor-client' | 'motor-rm';

export interface MotorTotRegisterPayload {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  partnerId: string;
  roles: MotorTotClientRole[];
}
