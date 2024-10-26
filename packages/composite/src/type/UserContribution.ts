export interface UserContribution {
  userId: number;
  user: string;
  pageId: number;
  revisionId: number;
  parentId: number;
  namespace: number;
  title: string;
  timestamp: string;
  new: boolean;
  minor: boolean;
  top: boolean;
  comment: string;
  parsedComment: string;
  size: number;
  sizeDiff: number;
  tags: string[];
}
