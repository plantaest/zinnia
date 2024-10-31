import { NativeToolActionComponentProps } from '@/tools/types/NativeTool';

export function DefaultNativeToolActionComponent({ children }: NativeToolActionComponentProps) {
  return children({});
}
