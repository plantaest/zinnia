import { Badge } from '@mantine/core';
import { appState } from '@/states/appState';

interface LengthDeltaBadgeProps {
  newLength: number;
  oldLength: number;
}

export function LengthDeltaBadge({ newLength, oldLength }: LengthDeltaBadgeProps) {
  const lengthDelta = newLength - oldLength;
  const lengthMark = lengthDelta > 0 ? '+' : lengthDelta < 0 ? '-' : '';
  const lengthColor = lengthDelta > 0 ? 'green' : lengthDelta < 0 ? 'red' : 'blue';

  return (
    <Badge ff="var(--mantine-alt-font-monospace)" h="1.625rem" radius="sm" color={lengthColor}>
      {lengthMark + appState.instance.numberFormat.get().format(Math.abs(lengthDelta))}
    </Badge>
  );
}
