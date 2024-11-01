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
import { PageTab } from '@/components/TabPanel/PageTab';
import { TabHelper } from '@/utils/TabHelper';

let readTab: { id: string; data: ReadTabData };
let diffTab: { id: string; data: DiffTabData };

export function TabMainPanel() {
  const activeTab = useSelector(appState.ui.activeTab);
  let otherTab = <NoneTab />;

  const isReadTab = TabHelper.isReads(activeTab);
  const isDiffTab = TabHelper.isDiffs(activeTab);
  const isOtherTab = !isReadTab && !isDiffTab;

  if (activeTab) {
    if (isReadTab) {
      readTab = { id: activeTab.id, data: activeTab.data };
    }

    if (isDiffTab) {
      diffTab = { id: activeTab.id, data: activeTab.data };
    }

    if (activeTab.type === TabType.PAGE) {
      otherTab = <PageTab tabData={activeTab.data} />;
    }

    if (activeTab.type === TabType.WELCOME) {
      otherTab = <WelcomeTab />;
    }
  }

  return (
    <Card className={classes.main} ref={tabMainPanelRef}>
      {/* Don't unmount ReadTab */}
      <Flex display={isReadTab ? undefined : 'none'} flex={1}>
        {readTab && <ReadTab tabId={readTab.id} tabData={readTab.data} />}
      </Flex>
      {/* Don't unmount DiffTab */}
      <Flex display={isDiffTab ? undefined : 'none'} flex={1}>
        {diffTab && <DiffTab tabId={diffTab.id} tabData={diffTab.data} />}
      </Flex>
      {isOtherTab && <Flex flex={1}>{otherTab}</Flex>}
    </Card>
  );
}
