import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorCodes } from '@gift-list/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';

export interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return next({
                    status: 401,
                    code: ErrorCodes.AUTH_TOKEN_EXPIRED,
                    message: 'Token expired or invalid',
                });
            }

            req.user = user as { id: string; email: string };
            next();
        });
    } else {
        return next({
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'Authorization header missing',
        });
    }
};

export const authenticateGuest = (req: Request, res: Response, next: NextFunction) => {
    const guestSession = req.cookies.guest_session;
    console.log(`[Auth] Checking guest session. Cookie present: ${!!guestSession}`);

    // 1. Check Guest Session
    if (guestSession) {
        try {
            const parsed = JSON.parse(Buffer.from(guestSession, 'base64').toString('utf8'));
            console.log(`[Auth] Valid guest session for: ${parsed.email}`);
            (req as any).guest = parsed;
            return next();
        } catch (error) {
            console.error('[Auth] Error parsing guest session cookie:', error);
        }
    }

    // 2. Check Celebrant JWT (so they can view their own public list)
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string };
            console.log(`[Auth] Authenticated via Celebrant JWT: ${decoded.email}`);
            (req as any).guest = { id: `celebrant-${decoded.id}`, email: decoded.email };
            return next();
        } catch (err) {
            console.log('[Auth] Invalid Celebrant JWT in guest auth');
        }
    }

    console.log('[Auth] Guest access denied - redirecting to email prompt');
    return next({
        status: 401,
        code: 'UNAUTHORIZED_GUEST',
        message: 'Guest session missing',
    });
};
