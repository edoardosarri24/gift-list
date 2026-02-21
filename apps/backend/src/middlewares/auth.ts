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

    if (!guestSession) {
        return next({
            status: 401,
            code: 'UNAUTHORIZED_GUEST',
            message: 'Guest session missing',
        });
    }

    // The session contains the guest access ID or email
    try {
        const parsed = JSON.parse(Buffer.from(guestSession, 'base64').toString('utf8'));
        (req as any).guest = parsed;
        next();
    } catch (error) {
        return next({
            status: 401,
            code: 'INVALID_GUEST_SESSION',
            message: 'Guest session invalid',
        });
    }
};
