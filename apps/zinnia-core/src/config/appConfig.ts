export const appConfig = Object.freeze({
  DEBUG: process.env.NODE_ENV === 'development',
  VERSION: APP_VERSION,
  API_USER_AGENT: `Zinnia/${APP_VERSION}`,
  USER_CONFIG_OPTION_KEY: 'userjs-zinnia-userConfig',
  MAX_WORKSPACE_LIMIT: 5,
  MAX_FILTER_LIMIT: 10,
  MAX_TAB_LIMIT: 50,
  MAX_TAB_HISTORY_LIMIT: 50,
  FEED_LIMITS: ['10', '25', '50', '75', '100', '250', '500'],
  TIMEFRAME_END_PERIODS: ['PT1H', 'PT2H', 'PT6H', 'PT12H', 'P1D', 'P3D', 'P7D', 'P14D', 'P30D'],
  MAX_FILTER_WIKIS: 10,
  TABS_OPTION_KEY: 'userjs-zinnia-tabs',
});
