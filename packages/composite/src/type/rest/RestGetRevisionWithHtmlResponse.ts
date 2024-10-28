// Example: https://en.wikipedia.org/w/rest.php/v1/revision/764138197/with_html
export interface RestGetRevisionWithHtmlResponse {
  id: number;
  size: number;
  minor: boolean;
  timestamp: string;
  content_model: string;
  page: {
    id: number;
    key: string;
    title: string;
  };
  license: {
    url: string;
    title: string;
  };
  user: {
    id: number;
    name: string;
  };
  comment: string;
  delta: number;
  html: string;
}
