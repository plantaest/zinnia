import { Card, Flex } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import classes from './TabMainPanel.module.css';
import { DiffTabData, ReadTabData, TabType } from '@/types/persistence/Tab';
import { WelcomeTab } from '@/components/TabPanel/WelcomeTab';
import { appState } from '@/states/appState';
import { DiffTab } from '@/components/TabPanel/DiffTab';
import { tabMainPanelRef } from '@/refs/tabMainPanelRef';
import { ReadTab } from '@/components/TabPanel/ReadTab';
import { NoneTab } from '@/components/TabPanel/NoneTab';

let diffTabData: DiffTabData;
let readTabData: ReadTabData;

export function TabMainPanel() {
  const activeTab = useSelector(appState.local.activeTab);

  if (activeTab) {
    if (activeTab.type === TabType.MAIN_READ || activeTab.type === TabType.READ) {
      readTabData = {
        wikiId: activeTab.data.wikiId,
        pageTitle: activeTab.data.pageTitle,
        redirect: activeTab.data.redirect,
      };
    }

    if (activeTab.type === TabType.MAIN_DIFF || activeTab.type === TabType.DIFF) {
      diffTabData = {
        wikiId: activeTab.data.wikiId,
        pageTitle: activeTab.data.pageTitle,
        fromRevisionId: activeTab.data.fromRevisionId,
        toRevisionId: activeTab.data.toRevisionId,
      };
    }
  }

  const otherTab = activeTab ? (
    activeTab.type === TabType.WELCOME ? (
      <WelcomeTab />
    ) : null
  ) : (
    <NoneTab />
  );

  const isReadTab = activeTab ? [TabType.MAIN_READ, TabType.READ].includes(activeTab.type) : false;
  const isDiffTab = activeTab ? [TabType.MAIN_DIFF, TabType.DIFF].includes(activeTab.type) : false;
  const isOtherTab = !isReadTab && !isDiffTab;

  return (
    <Card className={classes.main} ref={tabMainPanelRef}>
      {/* Don't unmount ReadTab */}
      <Flex display={isReadTab ? undefined : 'none'} flex={1}>
        {readTabData && (
          <ReadTab
            wikiId={readTabData.wikiId}
            pageTitle={readTabData.pageTitle}
            redirect={readTabData.redirect}
          />
        )}
      </Flex>
      {/* Don't unmount DiffTab */}
      <Flex display={isDiffTab ? undefined : 'none'} flex={1}>
        {diffTabData && (
          <DiffTab
            wikiId={diffTabData.wikiId}
            pageTitle={diffTabData.pageTitle}
            fromRevisionId={diffTabData.fromRevisionId}
            toRevisionId={diffTabData.toRevisionId}
          />
        )}
      </Flex>
      <Flex display={isOtherTab ? undefined : 'none'} flex={1}>
        {otherTab}
      </Flex>
    </Card>
  );
}
