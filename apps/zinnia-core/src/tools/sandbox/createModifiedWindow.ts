import { createModifiedLocation } from '@/tools/sandbox/createModifiedLocation';

export function createModifiedWindow(): Window {
  const modifiedWindow = { ...window };
  modifiedWindow.location = createModifiedLocation();
  return modifiedWindow;
}
