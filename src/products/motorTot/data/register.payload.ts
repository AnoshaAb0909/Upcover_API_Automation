import { generateMailosaurEmail } from '../../../core/mailosaur/generateMailosaurEmail';
import {
  generateDummyFirstName,
  generateDummyLastName,
} from '../../../shared/data/dummyData';
import type { MotorTotRegisterPayload } from '../types/register.payload.types';
import {
  MOTOR_TOT_CLIENT_ROLES,
  MOTOR_TOT_DEFAULT_PHONE_NUMBER,
  MOTOR_TOT_PARTNER_ID,
} from './register.defaults';

export function buildMotorTotRegisterPayload(
  overrides: Partial<MotorTotRegisterPayload> = {},
): MotorTotRegisterPayload {
  return {
    email: overrides.email ?? generateMailosaurEmail(),
    phoneNumber: overrides.phoneNumber ?? MOTOR_TOT_DEFAULT_PHONE_NUMBER,
    firstName: overrides.firstName ?? generateDummyFirstName(),
    lastName: overrides.lastName ?? generateDummyLastName(),
    partnerId: overrides.partnerId ?? MOTOR_TOT_PARTNER_ID,
    roles: overrides.roles ?? [...MOTOR_TOT_CLIENT_ROLES],
  };
}
