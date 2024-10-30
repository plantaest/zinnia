import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { WikiId } from '@/types/mw/WikiId';
import { wikis } from '@/utils/wikis';
import { Notice } from '@/utils/Notice';

export function usePatrol(wikiId: WikiId, revisionId: number) {
  const { formatMessage } = useIntl();

  return useMutation<void, CompositeError>({
    mutationKey: [wikiId, 'patrol', revisionId],
    mutationFn: () => wikis.getWiki(wikiId).patrol(revisionId),
    onError: () => Notice.error(formatMessage({ id: 'query.defaultErrorMessage' })),
  });
}
