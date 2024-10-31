import { markTool } from '@/tools/native/mark';
import { rollbackTool } from '@/tools/native/rollback';
import { restoreTool } from '@/tools/native/restore';
import { blankTool } from '@/tools/native/blank';
import { NativeTool } from '@/tools/types/NativeTool';

export const nativeTools: NativeTool[] = [markTool, rollbackTool, restoreTool, blankTool];

export const nativeToolsDict = Object.fromEntries(
  nativeTools.map((tool) => [tool.metadata.id, tool])
);
