import { Logger } from './logger.js';

const log = new Logger();

// running npm run ts:promises  causes error with the async
// removing async works fine.

async function fakeAsyncFunction() {
  log.result(`This is test`);
}

fakeAsyncFunction();
