export function cloneMwApi(
  mwForeignApiFactory: typeof mw.ForeignApi,
  actionApiUri: string
): typeof mw.Api {
  function ClonedFactory(this: unknown, options?: ConstructorParameters<typeof mw.Api>[0]) {
    return mwForeignApiFactory.apply(this, [actionApiUri, options]);
  }

  ClonedFactory.prototype = Object.create(mwForeignApiFactory.prototype);
  Object.assign(ClonedFactory.prototype, mwForeignApiFactory.prototype);

  return ClonedFactory as unknown as typeof mw.Api;
}
