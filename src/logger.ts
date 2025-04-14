export interface Logger {
  log(message: string): void;
}

export class ConsoleLogger implements Logger {
  log(message: string) {
    console.log(message);
  }
}
