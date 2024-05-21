export interface CompareRevisionsResult {
  fromId: number;
  fromRevisionId: number;
  fromNs: number;
  fromTitle: string;
  fromSize: number;
  fromTimestamp: string;
  fromUser: string;
  fromUserId: number;
  fromComment: string | null;
  fromParsedComment: string | null;
  toId: number;
  toRevisionId: number;
  toNs: number;
  toTitle: string;
  toSize: number;
  toTimestamp: string;
  toUser: string;
  toUserId: number;
  toComment: string | null;
  toParsedComment: string | null;
  prev: number;
  next: number;
  diffSize: number;
  body: string;
}
