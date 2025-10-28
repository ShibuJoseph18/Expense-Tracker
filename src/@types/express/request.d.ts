declare namespace Express {
  interface Request {
    validatedReqBody: any;
    jwtToken: any;
  }
}
