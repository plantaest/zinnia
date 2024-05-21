import { LangHelper } from '@/utils/LangHelper';

export namespace RegexHelper {
  // Ref: https://stackoverflow.com/a/432503
  export const getFirstGroup = (regex: RegExp, str: string) =>
    Array.from(str.matchAll(regex), (m) => m[1]);

  export const getNamedCapturingGroups = (regex: RegExp, str: string): Record<string, string> => {
    const result = {};
    let m;

    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex += 1;
      }

      Object.assign(result, LangHelper.removeFalsyFields(m.groups ?? {}));
    }

    return result;
  };
}
