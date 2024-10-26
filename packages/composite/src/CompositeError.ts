export class CompositeError extends Error {
  public code: string;
  public body: string | null;

  constructor(code: string, body: string | null) {
    super(`Oops, we have a bit of an issue with Composite. Code: ${code}. Body: ${body}`);
    this.name = 'CompositeError';
    this.code = code;
    this.body = body;
  }
}
