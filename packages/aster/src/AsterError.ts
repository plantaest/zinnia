export class AsterError extends Error {
  public code: string;
  public body: string | null;

  constructor(code: string, body: string | null) {
    super(`Oops, we have a bit of an issue with Aster. Code: ${code}. Body: ${body}`);
    this.name = 'AsterError';
    this.code = code;
    this.body = body;
  }
}
