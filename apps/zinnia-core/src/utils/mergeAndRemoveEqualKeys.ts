import { isEqual } from '@/utils/isEqual';

export function mergeAndRemoveEqualKeys(obj1: Record<string, any>, obj2: Record<string, any>) {
  const result: Record<string, any> = {};

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of allKeys) {
    if (!(key in obj1 && key in obj2 && isEqual(obj1[key], obj2[key]))) {
      result[key] = key in obj2 ? obj2[key] : obj1[key];
    }
  }

  return result;
}
