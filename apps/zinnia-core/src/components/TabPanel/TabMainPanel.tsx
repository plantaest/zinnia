import { Box, Card } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from '@legendapp/state/react';
import classes from './TabMainPanel.module.css';
import { DiffTabData, ReadTabData, TabType } from '@/types/persistence/Tab';
import { WelcomeTab } from '@/components/TabPanel/WelcomeTab';
import { appState } from '@/states/appState';
import { DiffTab } from '@/components/TabPanel/DiffTab';
import { tabMainPanelRef } from '@/refs/tabMainPanelRef';
import { ReadTab } from '@/components/TabPanel/ReadTab';
import { NoneTab } from '@/components/TabPanel/NoneTab';

export function TabMainPanel() {
  const activeTab = useSelector(appState.local.activeTab);

  const [diffTabData, setDiffTabData] = useState<DiffTabData | null>(null);
  const [readTabData, setReadTabData] = useState<ReadTabData | null>(null);

  useEffect(() => {
    if (activeTab) {
      if (activeTab.type === TabType.MAIN_READ || activeTab.type === TabType.READ) {
        setReadTabData({
          wikiId: activeTab.data.wikiId,
          pageTitle: activeTab.data.pageTitle,
          redirect: activeTab.data.redirect,
        });
      }

      if (activeTab.type === TabType.MAIN_DIFF || activeTab.type === TabType.DIFF) {
        setDiffTabData({
          wikiId: activeTab.data.wikiId,
          pageTitle: activeTab.data.pageTitle,
          fromRevisionId: activeTab.data.fromRevisionId,
          toRevisionId: activeTab.data.toRevisionId,
        });
      }
    }
  }, [activeTab]);

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
      <Box w="100%" h="100%" display={isReadTab ? undefined : 'none'}>
        {readTabData && (
          <ReadTab
            wikiId={readTabData.wikiId}
            pageTitle={readTabData.pageTitle}
            redirect={readTabData.redirect}
          />
        )}
      </Box>
      {/* Don't unmount DiffTab */}
      <Box w="100%" h="100%" display={isDiffTab ? undefined : 'none'}>
        {diffTabData && (
          <DiffTab
            wikiId={diffTabData.wikiId}
            pageTitle={diffTabData.pageTitle}
            fromRevisionId={diffTabData.fromRevisionId}
            toRevisionId={diffTabData.toRevisionId}
          />
        )}
      </Box>
      <Box w="100%" h="100%" display={isOtherTab ? undefined : 'none'}>
        {otherTab}
      </Box>
    </Card>
  );
}
