// Example: https://en.wikipedia.org/w/rest.php/v1/page/_/with_html
export interface RestErrorResponse {
  errorKey?: string;
  messageTranslations: Record<string, string>;
  httpCode: number;
  httpReason: string;
}
