import React, { FunctionComponent } from 'react';
import { WikiId } from '@/types/mw/WikiId';
import { TabType } from '@/types/persistence/Tab';
import { PageContext } from './PageContext';
import { WikiServerName } from '@/types/mw/WikiServerName';

export interface ExtendedTool {
  metadata: ExtendedToolMetadata;
  config: ExtendToolConfig;
  component: FunctionComponent<ExtendedToolComponentProps>;
}

export interface ExtendedToolMetadata {
  id: string;
  name: string;
  iconLabel: string;
}

export interface ExtendToolConfig {
  restriction: {
    allowedSites: WikiId[];
    allowedWikis: WikiId[];
    allowedRights: string[];
    allowedTabs: TabType[];
    allowedPages?: {
      test: (pageContext: PageContext) => boolean;
      reload: boolean;
    };
  };
  source: {
    server: string;
    page: string;
  };
  sandbox: {
    initialServer: WikiServerName | typeof CURRENT_WIKI;
    syncedWikiContext: boolean;
    targetSelector?: string;
    styles?: string;
    cleanupFunction?: (payload: ExtendedToolCleanupFunctionPayload) => void;
  };
}

export const CURRENT_WIKI: unique symbol = Symbol('CURRENT_WIKI');

interface ExtendedToolCleanupFunctionPayload {
  sandboxRoot: HTMLDivElement;
}

export interface ExtendedToolComponentProps {
  metadata: ExtendedToolMetadata;
  config: ExtendToolConfig;
  children: (payload: ExtendedToolComponentPayload) => React.ReactNode;
}

export interface ExtendedToolComponentPayload {
  trigger?: () => void;
  loading?: boolean;
  targetRef?: React.RefObject<HTMLButtonElement>;
}
