import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { RegexHelper } from '@/utils/RegexHelper';
import { decodeHtml } from '@/utils/decodeHtml';

const relativeStyleSheetLinksRegex = /href="(\/w\/load\.php[^"]+)"/g;

export function useGetWikiStyleSheet(wikiId: string, serverName: string, parsoidHtml: string) {
  const relativeStyleSheetLinks = RegexHelper.getFirstGroup(
    relativeStyleSheetLinksRegex,
    parsoidHtml
  );
  const absoluteStyleSheetLink =
    relativeStyleSheetLinks.length > 0
      ? `//${serverName}${decodeHtml(relativeStyleSheetLinks[0])}`
      : null;

  return useQuery({
    queryKey: [wikiId, 'getWikiStyleSheet', absoluteStyleSheetLink],
    queryFn: async () => {
      const response = await fetch(absoluteStyleSheetLink!);

      if (!response.ok) {
        throw new Error(`Unable to get ${wikiId} style sheet`);
      }

      const css = await response.text();

      // Fix body selector like: body:not(.skin-minerva) .liste-horizontale ul
      return css.replaceAll('body.', '.root.').replaceAll('body:', '.root:');
    },
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    enabled: Boolean(parsoidHtml) && Boolean(absoluteStyleSheetLink),
  });
}
