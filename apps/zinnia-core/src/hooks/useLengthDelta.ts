import { useSelector } from '@legendapp/state/react';
import { appState } from '@/states/appState';

export function useLengthDelta(newLength: number, oldLength: number) {
  const numberFormat = useSelector(appState.instance.numberFormat);

  const lengthDelta = newLength - oldLength;
  const lengthMark = lengthDelta > 0 ? '+' : lengthDelta < 0 ? '-' : '';
  const lengthColor = lengthDelta > 0 ? 'green' : lengthDelta < 0 ? 'red' : 'blue';

  return {
    lengthColor,
    lengthMark,
    lengthDelta: numberFormat.format(Math.abs(lengthDelta)),
  };
}
