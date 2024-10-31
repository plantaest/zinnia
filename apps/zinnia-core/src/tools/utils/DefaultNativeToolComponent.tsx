import { NativeToolComponentProps } from '@/tools/types/NativeTool';

export function DefaultNativeToolComponent({ children }: NativeToolComponentProps) {
  return children({});
}
