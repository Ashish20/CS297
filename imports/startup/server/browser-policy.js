/**
 * Browser Policy
 * Set security-related policies to be enforced by newer browsers.
 * These policies help prevent and mitigate common attacks like
 * cross-site scripting and clickjacking.
 */

import { BrowserPolicy } from 'meteor/browser-policy-common';

BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  '*.google-analytics.com',
  '*.mxpnl.com',
  '*.zendesk.com',
  '*.gstatic.com',
  'widget.cloudinary.com',
];

_.each(trusted, function(origin) {
  origin = 'https://' + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});

/**
 * allowed images
 */
const allowImageOrigin = ['via.placeholder.com', 'res.cloudinary.com'];
allowImageOrigin.forEach(o => BrowserPolicy.content.allowImageOrigin(o));

/**
 * allowed scripts
 */
// const allowScriptOrigin = [''];
// allowScriptOrigin.forEach(o => BrowserPolicy.content.allowScriptOrigin(o));

/**
 * allowed styles
 */
// const allowStyleOrigin = [''];
// allowStyleOrigin.forEach(o => BrowserPolicy.content.allowStyleOrigin(o));
