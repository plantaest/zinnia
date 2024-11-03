import { Badge, Loader } from '@mantine/core';
import { Change } from '@plantaest/composite';
import { useInViewport } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import { wikis } from '@/utils/wikis';
import { useGetOresScore } from '@/queries/useGetOresScore';

interface OresScoreBadgeProps {
  change: Change;
}

export function OresScoreBadge({ change }: OresScoreBadgeProps) {
  const { ref, inViewport } = useInViewport();
  const ores = wikis.getWiki(change.wikiId).getConfig().ores;

  const {
    data: fetchedScore = 0,
    isLoading,
    isError,
    refetch,
  } = useGetOresScore(change.wikiId, change.revisionId, inViewport);

  const show =
    ['edit', 'new'].includes(change.type) &&
    ores &&
    ((ores.support === 'integrated' && change.oresScores && ores.model in change.oresScores) ||
      ores.support === 'basic');

  const score = ores
    ? Math.round(
        (ores.support === 'integrated' && change.oresScores && ores.model in change.oresScores
          ? change.oresScores[ores.model].true // According to API RecentChanges response
          : ores.support === 'basic'
            ? fetchedScore
            : 0) * 100
      )
    : 0;

  // Ref: https://github.com/he7d3r/mw-gadget-ScoredRevisions/blob/master/src/ScoredRevisions.js#L37
  const color = score >= 80 ? 'red' : score >= 58 ? 'orange' : score >= 45 ? 'yellow' : 'blue';

  const loading = ores && ores.support === 'basic' && isLoading;

  const handleMouseEnterBadge = () => {
    ores && ores.support === 'basic' && isError && refetch();
  };

  return (
    show && (
      <Badge
        ref={ref}
        ff="var(--zinnia-font-monospace)"
        h="1.625rem"
        radius="sm"
        color={color}
        styles={{ label: { display: 'flex' } }}
        onMouseEnter={handleMouseEnterBadge}
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
