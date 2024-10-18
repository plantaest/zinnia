export interface Revision {
  revisionId: number;
  parentId: number;
  userHidden: boolean;
  user: string;
  anon: boolean;
  minor: boolean;
  size: number;
  parentSize: number;
  timestamp: string;
  commentHidden: boolean;
  parsedComment: string;
}
