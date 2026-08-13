export type TargetEnvironment = 'dev' | 'staging';

export const ENVIRONMENT_PRESETS: Record<
  TargetEnvironment,
  { label: string; baseUrl: string }
> = {
  dev: {
    label: 'Development',
    baseUrl: 'https://dev-api.upcover.com',
  },
  staging: {
    label: 'Staging',
    baseUrl: 'https://staging-api.upcover.com',
  },
};

export function parseTargetEnvironment(
  value: string | undefined,
): TargetEnvironment {
  const normalized = value?.trim().toLowerCase();

  if (normalized === 'staging') {
    return 'staging';
  }

  return 'dev';
}

export function resolvePresetBaseUrl(environment: TargetEnvironment): string {
  return ENVIRONMENT_PRESETS[environment].baseUrl;
}
