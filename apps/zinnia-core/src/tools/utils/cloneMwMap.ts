import { zmw } from '@/utils/zmw';

export function cloneMwMap(originalMap: mw.Map) {
  const newMap = new zmw.Map();
  // @ts-ignore
  const values = originalMap.values;

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      newMap.set(key, values[key]);
    }
  }

  return newMap;
}
