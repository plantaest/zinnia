import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { WikiId } from '@/types/mw/WikiId';
import { wikis } from '@/utils/wikis';
import { Notification } from '@/utils/Notification';

export function usePatrol(wikiId: WikiId, revisionId: number) {
  const { formatMessage } = useIntl();

  return useMutation<void, CompositeError>({
    mutationKey: [wikiId, 'patrol', revisionId],
    mutationFn: () => wikis.getWiki(wikiId).patrol(revisionId),
    onError: () => Notification.error(formatMessage({ id: 'query.defaultErrorMessage' })),
  });
}
