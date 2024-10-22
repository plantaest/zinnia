// Refs:
// https://xtools.wmcloud.org/api/page/pageinfo/en.wikipedia.org/Metallica?format=json
// https://xtools.wmcloud.org/api/page/pageinfo/vi.wikipedia.org/Rihanna?format=json
export interface XtoolsPageInfoResponse {
  warning: string[];
  project: string;
  page: string;
  format: string;
  watchers: number;
  pageviews: number;
  pageviews_offset: number;
  revisions: number;
  editors: number;
  ip_edits: number;
  minor_edits: number;
  creator: string;
  creator_editcount: number;
  created_at: string;
  created_rev_id: number;
  modified_at: string;
  secs_since_last_edit: number;
  modified_rev_id: number;
  assessment?: {
    value: string;
    color: string;
    category: string;
    badge: string;
  };
  last_edit_id: number;
  author: string;
  author_editcount: number;
  elapsed_time: number;
}
