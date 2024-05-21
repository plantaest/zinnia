import { Box, useComputedColorScheme } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { RegexHelper } from '@/utils/RegexHelper';

const styleSheetLinkRegex = /<link rel="stylesheet" href="[^"]+"\/>/g;
const bodyTagRegex = /<body[^>]+>/;
const bodyAttributesRegex =
  /(id="(?<id>\w+)")|(lang="(?<lang>\w+)")|(class="(?<class>[^"]+)")|(dir="(?<dir>\w+)")/gm;

interface ParsoidOutputProps {
  html: string;
  options: {
    wikiId: string;
    serverName: string;
  };
}

export function ParsoidOutput({ html, options }: ParsoidOutputProps) {
  const computedColorScheme = useComputedColorScheme();
  const rootRef = useRef<HTMLDivElement>(null);

  const processedHtml = html
    // Remove style sheet link
    .replaceAll(styleSheetLinkRegex, '')
    // Change relative anchors to absolute ones
    .replaceAll('href="./', `href="//${options.serverName}/wiki/`);

  const bodyTabMatches = processedHtml.match(bodyTagRegex);
  const bodyTag = bodyTabMatches && bodyTabMatches.length > 0 ? bodyTabMatches[0] : '';
  const bodyAttributes = RegexHelper.getNamedCapturingGroups(bodyAttributesRegex, bodyTag);

  useEffect(() => {
    if (rootRef.current && Boolean(processedHtml)) {
      const root = rootRef.current;
      const anchors = root.querySelectorAll<HTMLAnchorElement>('a');
      const forms = root.querySelectorAll<HTMLFormElement>('form');

      for (const anchor of anchors) {
        anchor.target = '_blank';
      }

      for (const form of forms) {
        form.target = '_blank';
      }
    }
  }, [rootRef.current, processedHtml]);

  return (
    <Box
      ref={rootRef}
      id={bodyAttributes.id}
      lang={bodyAttributes.lang}
      className={`root ${bodyAttributes.class}`}
      dir={bodyAttributes.dir}
      data-mantine-color-scheme={computedColorScheme}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
