// Example: https://en.wikipedia.org/w/rest.php/v1/page/DKSH/with_html
export interface RestGetPageWithHtmlResponse {
  id: number;
  key: string;
  title: string;
  latest: {
    id: number;
    timestamp: string;
  };
  content_model: string;
  license: {
    url: string;
    title: string;
  };
  html: string;
}
