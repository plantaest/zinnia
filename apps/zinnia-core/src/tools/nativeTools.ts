import { NativeTool } from '@/tools/types/ZinniaTool';
import { MarkTool } from '@/tools/native/mark';
import { RollbackTool } from '@/tools/native/rollback';
import { RestoreTool } from '@/tools/native/restore';
import { BlankTool } from '@/tools/native/blank';

export const nativeTools: NativeTool[] = [MarkTool, RollbackTool, RestoreTool, BlankTool];

export const nativeToolsDict = Object.fromEntries(nativeTools.map((tool) => [tool.id, tool]));
