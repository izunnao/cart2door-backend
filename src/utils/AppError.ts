export default class AppError extends Error {
  statusCode = 0;
  details: any;

  constructor(
    statusCode: number,
    message: string,
    stack = "",
    details: {
      error?: any;
      retry?: { count: number; function: (param: any) => Promise<any>; param?: any };
    } | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    if (stack) {
      this.stack = stack;
    } else {
      this.stack = new Error().stack || "";
    }
  }
}

export const throwErrorOn = (condition: boolean, statusCode: number, errorMessage: string) => {
  if (condition) {
    throw new AppError(statusCode, errorMessage);
  }
};
