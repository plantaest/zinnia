export namespace LangHelper {
  export const removeFalsyFields = <T extends {}>(obj: T) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => Boolean(v)));

  export const isNumeric = (num: string) => !Number.isNaN(num);

  // Ref: https://stackoverflow.com/a/71247432
  export const partitionBy = <T>(arr: T[], predicate: (v: T, i: number, ar: T[]) => boolean) =>
    arr.reduce(
      (acc: T[][], item, index, array) => {
        acc[+!predicate(item, index, array)].push(item);
        return acc;
      },
      [[], []]
    );
}
