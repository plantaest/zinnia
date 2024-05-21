export const shortenPageTitle = (pageTitle: string) =>
  pageTitle.length > 28 ? `${pageTitle.slice(0, 28)}...` : pageTitle;
