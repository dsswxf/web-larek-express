import { NextFunction, Request, Response } from 'express';

interface IHttpError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: IHttpError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode ?? 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  return res.status(statusCode).send({ message });
};

export default errorHandler;
