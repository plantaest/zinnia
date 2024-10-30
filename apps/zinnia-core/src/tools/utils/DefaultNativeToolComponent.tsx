import { NativeToolComponentProps } from '@/tools/types/ZinniaTool';

export function DefaultNativeToolComponent({ children }: NativeToolComponentProps) {
  return children({});
}
