import { Card, Flex } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import classes from './TabMainPanel.module.css';
import { DiffTabData, PageTabData, ReadTabData, TabType } from '@/types/persistence/Tab';
import { WelcomeTab } from '@/components/TabPanel/WelcomeTab';
import { appState } from '@/states/appState';
import { DiffTab } from '@/components/TabPanel/DiffTab';
import { tabMainPanelRef } from '@/refs/tabMainPanelRef';
import { ReadTab } from '@/components/TabPanel/ReadTab';
import { NoneTab } from '@/components/TabPanel/NoneTab';
import { PageTab } from '@/components/TabPanel/PageTab';

let diffTabData: DiffTabData;
let readTabData: ReadTabData;
let pageTabData: PageTabData;

export function TabMainPanel() {
  const activeTab = useSelector(appState.local.activeTab);
  let otherTab = <NoneTab />;

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

    if (activeTab.type === TabType.PAGE) {
      pageTabData = {
        wikiId: activeTab.data.wikiId,
        pageTitle: activeTab.data.pageTitle,
      };
    }

    if (activeTab.type === TabType.WELCOME) {
      otherTab = <WelcomeTab />;
    }
  }

  const isReadTab = activeTab ? [TabType.MAIN_READ, TabType.READ].includes(activeTab.type) : false;
  const isDiffTab = activeTab ? [TabType.MAIN_DIFF, TabType.DIFF].includes(activeTab.type) : false;
  const isPageTab = activeTab ? activeTab.type === TabType.PAGE : false;
  const isOtherTab = !isReadTab && !isDiffTab && !isPageTab;

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
      {/* Don't unmount PageTab */}
      <Flex display={isPageTab ? undefined : 'none'} flex={1}>
        {pageTabData && <PageTab wikiId={pageTabData.wikiId} pageTitle={pageTabData.pageTitle} />}
      </Flex>
      <Flex display={isOtherTab ? undefined : 'none'} flex={1}>
        {otherTab}
      </Flex>
    </Card>
  );
}
