import { appConfig } from '@/config/appConfig';

export const serverUri = (path?: string) => {
  const host =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8050/'
      : `https://tools-static.wmflabs.org/zinnia/builds/${appConfig.VERSION}/`;
  return path ? host + path : host;
};
