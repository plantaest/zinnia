export function cloneFactory<Factory extends Function>(originalFactory: Factory) {
  function ClonedFactory(this: unknown, ...args: any[]) {
    return originalFactory.apply(this, args);
  }

  ClonedFactory.prototype = Object.create(originalFactory.prototype);
  Object.assign(ClonedFactory.prototype, originalFactory.prototype);

  return ClonedFactory as unknown as Factory;
}
