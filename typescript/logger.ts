import chalk from 'chalk';
const log = console.log;

export class Logger {
  result(message: string, result?: string | boolean): void {
    let loggedResult = '';
    if (typeof result === 'boolean') {
      if (!result) {
        loggedResult = chalk.red(result);
      }
    }
    log(`${chalk.green.bold('Result: ')} ${chalk.green(message)} ${chalk.green(loggedResult)}`);
  }
  performance(message: string, start: number, end: number): void {
    const total = end - start;
    log(`
      ${chalk.green.bold('Result: ')} ${chalk.green(message)} 
      ${chalk.green.bold(`Total: `)} ${chalk.green(`${total.toFixed(4)} ms`)}
    `);
  }

  error(error: any): void {
    log(`
      ${chalk.red.bold('Encountered an error: ')} ${chalk.red(error)} 
    `);
  }
}
