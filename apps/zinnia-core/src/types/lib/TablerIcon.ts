import { IconProps } from '@tabler/icons-react';
import React, {
  CSSProperties,
  ForwardRefExoticComponent,
  FunctionComponent,
  RefAttributes,
} from 'react';

type TablerIconsProps = Partial<
  ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<FunctionComponent<IconProps>>>
> & {
  className?: string;
  size?: string | number;
  stroke?: string | number;
  strokeWidth?: string | number;
  style?: CSSProperties;
};

export type TablerIcon = React.FunctionComponent<TablerIconsProps>;
