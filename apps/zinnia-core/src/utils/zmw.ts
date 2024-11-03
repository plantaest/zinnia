// The current MediaWiki instance in Zinnia is used for tracking
export const zmw = mw as typeof mediaWiki & { jqueryMsg: unknown };

// Ignore warning on Console: Use of "jqueryMsg" is deprecated. mw.jqueryMsg is a @private library.
delete zmw.jqueryMsg;
