import { Badge } from '@mantine/core';
import { useLengthDelta } from '@/hooks/useLengthDelta';

interface LengthDeltaBadgeProps {
  newLength: number;
  oldLength: number;
}

export function LengthDeltaBadge({ newLength, oldLength }: LengthDeltaBadgeProps) {
  const { lengthColor, lengthMark, lengthDelta } = useLengthDelta(newLength, oldLength);

  return (
    <Badge ff="var(--zinnia-font-monospace)" h="1.625rem" radius="sm" color={lengthColor}>
      {lengthMark + lengthDelta}
    </Badge>
  );
}
