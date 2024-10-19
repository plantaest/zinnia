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
  sha1Hidden: boolean;
  sha1: string;
  commentHidden: boolean;
  parsedComment: string;
}
