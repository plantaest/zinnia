import React, { FunctionComponent } from 'react';
import { WikiId } from '@/types/mw/WikiId';
import { TabType } from '@/types/persistence/Tab';
import { PageContext } from './PageContext';

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
    allowedWikis: WikiId[] | typeof SYNCED_WIKI_CONTEXT;
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
  sandboxTargetSelector?: string;
  styles?: string;
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

export const SYNCED_WIKI_CONTEXT: unique symbol = Symbol('SYNCED_WIKI_CONTEXT');
