import chalk from 'chalk';
const log = console.log;

export class Logger {
  result(message, result) {
    let loggedResult = chalk.green(result);
    if (typeof result === 'boolean') {
      if (result === false) {
        loggedResult = chalk.red(result);
      }
    }
    return log(`
      ${chalk.green.bold('Result: ')} ${chalk.green(message)} ${loggedResult}
    `);
  }

  performance(message, start, end) {
    const total = end - start;
    return log(`
      ${chalk.green.bold('Result: ')} ${chalk.green(message)} 
      ${chalk.green.bold(`Total: `)} ${chalk.green(`${total.toFixed(4)} ms`)}
    `);
  }
}
