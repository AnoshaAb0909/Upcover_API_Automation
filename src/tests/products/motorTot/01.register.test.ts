import { buildMotorTotRegisterPayload } from '../../../products/motorTot/data/register.payload';
import { MOTOR_TOT_CLIENT_ROLES, MOTOR_TOT_PARTNER_ID } from '../../../products/motorTot/data/register.defaults';
import { registerMotorTotClient } from '../../../products/motorTot/services/register.service';
import { expectApiStatus } from '../../helpers/expectApiStatus';

describe('MotorTOT AU Register API', () => {
  it('should register a motor client with a Mailosaur email', async () => {
    const payload = buildMotorTotRegisterPayload();

    expect(payload.email).toMatch(/@.+\.mailosaur\.net$/);
    expect(payload.partnerId).toBe(MOTOR_TOT_PARTNER_ID);
    expect(payload.roles).toEqual([...MOTOR_TOT_CLIENT_ROLES]);

    const response = await registerMotorTotClient(payload);

    expectApiStatus(response, 200);
  });
});
