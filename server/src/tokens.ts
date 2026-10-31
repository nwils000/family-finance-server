// The one place secret tokens are made and hashed: refresh tokens (auth.ts) and
// every single-use emailed or shared link (password reset, email verification,
// grown-up invites). Only the SHA-256 of a token is ever stored, so a database
// leak hands out no working link or session.
import crypto from 'crypto';
import { z } from 'zod';
import { config } from './config.js';

export const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

/** A fresh random token, hex encoded. Links use 32 bytes (64 characters). */
export const newToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

/** The shape every link token arrives in; anything else is refused before a lookup. */
export const linkToken = (message: string) => z.string().regex(/^[a-f0-9]{64}$/, message);

/**
 * A link into the app that carries a secret. The secret rides in the URL fragment
 * (`/reset-password#token=...`), which browsers never send to a server, a log or a
 * Referer header. The page reads it, then wipes it from the address bar.
 */
export const appLink = (path: string, key: string, token: string) => `${config.appUrl}${path}#${key}=${token}`;
