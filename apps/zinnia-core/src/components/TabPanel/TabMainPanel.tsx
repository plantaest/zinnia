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

let readTabData: ReadTabData;
let diffTabData: DiffTabData;

export function TabMainPanel() {
  const activeTab = useSelector(appState.ui.activeTab);
  let otherTab = <NoneTab />;

  const isReadTab = TabHelper.isReads(activeTab);
  const isDiffTab = TabHelper.isDiffs(activeTab);
  const isOtherTab = !isReadTab && !isDiffTab;

  if (activeTab) {
    if (isReadTab) {
      readTabData = activeTab.data;
    }

    if (isDiffTab) {
      diffTabData = activeTab.data;
    }

    if (activeTab.type === TabType.PAGE) {
      otherTab = <PageTab data={activeTab.data} />;
    }

    if (activeTab.type === TabType.WELCOME) {
      otherTab = <WelcomeTab />;
    }
  }

  return (
    <Card className={classes.main} ref={tabMainPanelRef}>
      {/* Don't unmount ReadTab */}
      <Flex display={isReadTab ? undefined : 'none'} flex={1}>
        {readTabData && <ReadTab data={readTabData} />}
      </Flex>
      {/* Don't unmount DiffTab */}
      <Flex display={isDiffTab ? undefined : 'none'} flex={1}>
        {diffTabData && <DiffTab data={diffTabData} />}
      </Flex>
      {isOtherTab && <Flex flex={1}>{otherTab}</Flex>}
    </Card>
  );
}
