export interface Revision {
  revisionId: number;
  parentId: number;
  minor: boolean;
  userHidden: boolean;
  user: string;
  anon: boolean;
  timestamp: string;
  size: number;
  parentSize: number;
  sha1Hidden: boolean;
  sha1: string;
  commentHidden: boolean;
  comment: string;
  parsedComment: string;
  tags: string[];
}
