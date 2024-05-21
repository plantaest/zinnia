import { Badge, Loader } from '@mantine/core';
import { Change } from '@plantaest/aster';
import { useInViewport } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import { wikis } from '@/utils/wikis';
import { useGetOresAntiVandalModelScore } from '@/queries/useGetOresAntiVandalModelScore';

interface OresScoreBadgeProps {
  change: Change;
}

export function OresScoreBadge({ change }: OresScoreBadgeProps) {
  const { ref, inViewport } = useInViewport();

  const wiki = wikis.getWiki(change.wikiId);
  const oresSupport = wiki.getConfig().oresSupport;
  const oresAntiVandalModel = wiki.getConfig().oresAntiVandalModel;

  const show =
    ['edit', 'new'].includes(change.type) &&
    ((oresSupport === 'integrated' &&
      change.oresScores &&
      oresAntiVandalModel! in change.oresScores) ||
      oresSupport === 'basic');

  const integratedScore =
    oresSupport === 'integrated' && change.oresScores && oresAntiVandalModel! in change.oresScores
      ? change.oresScores[oresAntiVandalModel!].true // According to API RecentChanges response
      : 0;

  const {
    data: fetchedScore = 0,
    isLoading,
    isError,
    refetch,
  } = useGetOresAntiVandalModelScore(change.wikiId, change.revisionId, inViewport);

  const score = Math.round(
    (oresSupport === 'integrated' ? integratedScore : oresSupport === 'basic' ? fetchedScore : 0) *
      100
  );

  // Ref: https://github.com/he7d3r/mw-gadget-ScoredRevisions/blob/master/src/ScoredRevisions.js#L37
  const color = score >= 80 ? 'red' : score >= 58 ? 'orange' : score >= 45 ? 'yellow' : 'blue';

  const loading = oresSupport === 'basic' && isLoading;

  return (
    show && (
      <Badge
        ref={ref}
        ff="var(--mantine-alt-font-monospace)"
        h="1.625rem"
        radius="sm"
        color={color}
        styles={{ label: { display: 'flex' } }}
        onMouseEnter={() => oresSupport === 'basic' && isError && refetch()}
      >
        {loading ? (
          <Loader color="white" size={12} />
        ) : isError ? (
          <IconAlertTriangle size="1rem" />
        ) : (
          `${score}%`
        )}
      </Badge>
    )
  );
}
