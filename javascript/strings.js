// Related Medium Article
// https://medium.com/javascript-in-plain-english/useful-examples-of-almost-all-javascript-string-functions-4131f3f990f2

import { Logger } from './logger.js';
const log = new Logger();

const userFeature = ` 12345: Create shipping component with 'Use this address' and 'Add new address...' buttons `;

// 1) trim the extra spaces before and after the string. Not doing this step would lead to dashes in the step 2
// 2) replace all spaces with a dash
// 3) replace all characters that are NOT A-Z (capital), a-z (lowercase), numbers 0-9 and dashes with an empty string
// 4) make all characters in the string lowercase
const formattedUserFeature = userFeature
  .trim()
  .replace(/ /g, '-')
  .replace(/[^A-Za-z0-9-]+/g, '')
  .toLowerCase()
  .concat('.js');

log.result('formatted string', formattedUserFeature);

log.result(`slice first five:`, formattedUserFeature.slice(0, 5));

log.result(`endsWith '.js': `, formattedUserFeature.endsWith('.js'));

log.result(`startsWith '10': `, formattedUserFeature.startsWith('10'));

log.result(`includes 'shipping': `, formattedUserFeature.includes('shipping'));
