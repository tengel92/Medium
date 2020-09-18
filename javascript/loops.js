import { Logger } from './logger.js';
import { performance } from 'perf_hooks';

const log = new Logger();

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const simpleArray = ['string1', 'string2'];

const forEachExample = async () => {
  const startForEach = performance.now();
  simpleArray.forEach(async (item) => {
    const start = performance.now();

    await delay(1000);
    log.result(`This is  `, item);

    const end = performance.now();
    log.performance(`forEach`, start, end);
  });
  const endForEach = performance.now();
  log.performance(`Total of forEach`, startForEach, endForEach);
};

const forOfExample = async () => {
  const startForOf = performance.now();
  for (const item of simpleArray) {
    const start = performance.now();

    await delay(1000);
    log.result(`This is  `, item);

    const end = performance.now();
    log.performance(`forEach`, start, end);
  }

  const endForOf = performance.now();
  log.performance(`total of for of`, startForOf, endForOf);
};

forEachExample();
forOfExample();
