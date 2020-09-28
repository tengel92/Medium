import chalk from 'chalk';
const log = console.log;

export class Logger {
  result(message: string, result?: string) {
    let loggedResult = '';
    if (result && typeof result === 'boolean') {
      if (result === false) {
        loggedResult = chalk.red(result);
      }
    }
    return log(`${chalk.green.bold('Result: ')} ${chalk.green(message)} ${chalk.green(loggedResult)}`);
  }

  performance(message: string, start: number, end: number) {
    const total = end - start;
    return log(`
      ${chalk.green.bold('Result: ')} ${chalk.green(message)} 
      ${chalk.green.bold(`Total: `)} ${chalk.green(`${total.toFixed(4)} ms`)}
    `);
  }

  error(error: any) {
    return log(`
      ${chalk.red.bold('Encountered an error: ')} ${chalk.red(error)} 
    `);
  }
}
