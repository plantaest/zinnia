import { Text, TextProps } from '@mantine/core';
import { useLengthDelta } from '@/hooks/useLengthDelta';

interface LengthDeltaTextProps extends TextProps {
  newLength: number;
  oldLength: number;
}

export function LengthDeltaText({ newLength, oldLength, ...textProps }: LengthDeltaTextProps) {
  const { lengthColor, lengthMark, lengthDelta } = useLengthDelta(newLength, oldLength);
  return (
    <Text {...textProps} c={lengthColor}>
      {lengthMark + lengthDelta}
    </Text>
  );
}
