import React, { FunctionComponent } from 'react';
import { WikiId } from '@/types/mw/WikiId';
import { TabType } from '@/types/persistence/Tab';
import { PageContext } from './PageContext';
import { WikiServerName } from '@/types/mw/WikiServerName';

export interface ExtendedTool {
  metadata: ExtendedToolMetadata;
  config: ExtendedToolConfig;
  component: FunctionComponent<ExtendedToolComponentProps>;
}

export interface ExtendedToolMetadata {
  id: string;
  name: string;
  iconLabel: string;
}

export interface ExtendedToolConfig {
  restriction: {
    allowedSites?: WikiId[];
    allowedWikis?: WikiId[];
    allowedRights?: string[];
    allowedTabs?: TabType[];
    allowedPages?: (pageContext: PageContext) => boolean;
  };
  source: {
    server: string;
    page: string;
  };
  sandbox: {
    initialServer: WikiServerName | typeof CURRENT_WIKI;
    targetSelector?: string;
    syncedWikiContext?: boolean;
    styles?: string;
    cleanupFunction?: (payload: ExtendedToolCleanupFunctionPayload) => void;
    openInNewTab?: boolean;
  };
}

export const CURRENT_WIKI: unique symbol = Symbol('CURRENT_WIKI');

interface ExtendedToolCleanupFunctionPayload {
  sandboxRoot: HTMLDivElement;
}

export interface ExtendedToolComponentProps {
  metadata: ExtendedToolMetadata;
  config: ExtendedToolConfig;
  children: (payload: ExtendedToolComponentPayload) => React.ReactNode;
}

export interface ExtendedToolComponentPayload {
  trigger?: () => void;
  loading?: boolean;
  targetRef?: React.RefObject<HTMLButtonElement>;
}
