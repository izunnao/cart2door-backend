declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      username: string;
      // Add other properties of your user object here
    };
    // Or if you're using Passport.js:
    // user?: Express.User; // If Passport.js is installed, it exports an Express.User interface
  }
}