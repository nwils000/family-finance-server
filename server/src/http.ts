import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { Types } from 'mongoose';
import { z, ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

export const notFound = (what = 'Not found') => new HttpError(404, what);

/** Wraps an async handler so thrown errors reach the error middleware. */
export const handle =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).then((body) => {
      if (!res.headersSent) res.json(body ?? { ok: true });
    }, next);
  };

/** Parse a request body or query with zod. Never spread raw input into a query. */
export const parse = <T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> => schema.parse(input);

export const objectId = z.string().refine((s) => Types.ObjectId.isValid(s), 'Invalid id');
export const cents = z.number().int().min(0).max(1_000_000);
export const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Client mistakes thrown by middleware (body-parser and friends), mapped to a generic reply. */
const CLIENT_ERRORS: Record<number, { error: string; code: string }> = {
  400: { error: 'That request could not be read', code: 'BAD_REQUEST' },
  413: { error: 'That request is too big', code: 'TOO_LARGE' },
  415: { error: 'That content type is not supported', code: 'BAD_CONTENT_TYPE' },
};

/**
 * The one error reply. Never echoes or logs a raw error object: body-parser errors
 * carry the request body (passwords included) on `err.body`, so a 4xx from
 * middleware gets a generic message and no log, and a 500 logs one structured line
 * (name, message, stack, request id) and nothing else.
 */
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues[0]?.message ?? 'Invalid input', issues: err.issues });
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, code: err.code });
  const e = (err ?? {}) as { status?: unknown; statusCode?: unknown; name?: unknown; message?: unknown; stack?: unknown };
  const status = typeof e.status === 'number' ? e.status : typeof e.statusCode === 'number' ? e.statusCode : 500;
  if (status >= 400 && status < 500) {
    return res.status(status).json(CLIENT_ERRORS[status] ?? { error: 'That request was not accepted', code: 'BAD_REQUEST' });
  }
  console.error(
    JSON.stringify({
      level: 'error',
      msg: 'unhandled error',
      id: req.id,
      name: typeof e.name === 'string' ? e.name : undefined,
      message: typeof e.message === 'string' ? e.message : String(err),
      stack: typeof e.stack === 'string' ? e.stack : undefined,
    }),
  );
  res.status(500).json({ error: 'Something went wrong' });
};
