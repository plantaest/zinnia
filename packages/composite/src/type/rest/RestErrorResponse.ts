// Example: https://en.wikipedia.org/w/rest.php/v1/page/_/with_html
export interface RestErrorResponse {
  errorKey?: string;
  messageTranslations: Record<string, string>;
  httpCode: number;
  httpReason: string;
}

// When a page was deleted:
// https://vi.wikipedia.org/w/rest.php/v1/page/Văn_học_Anglo-Saxon/with_html?redirect=no
// -> 404 Not Found
// {
//   "errorKey": "rest-nonexistent-title",
//   "messageTranslations": {
//     "vi": "The specified page (Văn_học_Anglo-Saxon) does not exist",
//     "en": "The specified page (Văn_học_Anglo-Saxon) does not exist"
//   },
//   "httpCode": 404,
//   "httpReason": "Not Found"
// }
