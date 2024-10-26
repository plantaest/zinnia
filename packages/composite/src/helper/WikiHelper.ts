export class WikiHelper {
  public static createActionApiUri(serverName: string): string {
    // Example: https://en.wikipedia.org/w/api.php
    return `https://${serverName}/w/api.php`;
  }
}
