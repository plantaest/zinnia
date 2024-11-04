import { useQuery } from '@tanstack/react-query';
import { WikiServerName } from '@/types/mw/WikiServerName';

export function useGetUserScriptSource(serverName: WikiServerName, pageTitle: string) {
  return useQuery<string>({
    queryKey: ['getUserScriptSource', serverName, pageTitle],
    queryFn: async () => {
      const response = await fetch(
        `https://${serverName}/w/rest.php/v1/page/${encodeURIComponent(pageTitle)}`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to get user-script "${pageTitle}" of ${serverName}. Details: ${JSON.stringify(await response.json())}`
        );
      }

      return (await response.json()).source;
    },
    staleTime: Infinity,
  });
}
