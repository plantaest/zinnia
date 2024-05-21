import { tabMainPanelRef } from '@/refs/tabMainPanelRef';

export const scrollToTopTabMainPanel = () => {
  if (Number(tabMainPanelRef.current?.scrollTop) > 0) {
    tabMainPanelRef.current?.scrollTo({ top: 0 });
  }
};
