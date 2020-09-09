import chalk from 'chalk';

const log = console.log;

export class Logger {
  result(message: string, result: string) {
    let loggedResult = chalk.green(result);
    if (typeof result === 'boolean') {
      if (result === false) {
        loggedResult = chalk.red(result);
      }
    }
    return log(`${chalk.green.bold('Result: ')} ${chalk.green(message)} ${loggedResult}`);
  }
}
