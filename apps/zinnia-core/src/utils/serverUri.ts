import { appConfig } from '@/config/appConfig';

export const serverUri = (path?: string) => {
  const host =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8050/'
      : `https://tools-static.wmflabs.org/zinnia/builds/${import.meta.env.MODE === 'canary' ? 'canary' : appConfig.VERSION}/`;
  return path ? host + path : host;
};
