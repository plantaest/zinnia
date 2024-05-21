import { decodeHtml } from '@/utils/decodeHtml';

export const sanitizeHtml = (html: string) =>
  decodeHtml(html)
    .replace(/(<([^>]+)>)/gi, '')
    .trim();
