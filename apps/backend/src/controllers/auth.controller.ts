import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { RegisterUserInput, LoginUserInput, ErrorCodes } from '@gift-list/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';

const generateTokens = (user: { id: string; email: string }) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as RegisterUserInput;

        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw { status: 409, code: ErrorCodes.AUTH_EMAIL_ALREADY_EXISTS, message: 'Email already exists' };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
        });

        const { accessToken, refreshToken } = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ token: accessToken, user: { id: user.id, email: user.email } });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as LoginUserInput;

        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw { status: 401, code: ErrorCodes.AUTH_INVALID_CREDENTIALS, message: 'Invalid credentials' };
        }

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
            throw { status: 401, code: ErrorCodes.AUTH_INVALID_CREDENTIALS, message: 'Invalid credentials' };
        }

        const { accessToken, refreshToken } = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ token: accessToken, user: { id: user.id, email: user.email } });
    } catch (err) {
        next(err);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            throw { status: 401, code: ErrorCodes.AUTH_TOKEN_EXPIRED, message: 'Refresh token missing' };
        }

        const payload = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: payload.id } });

        if (!user || user.refreshToken !== refreshToken) {
            throw { status: 401, code: ErrorCodes.AUTH_TOKEN_EXPIRED, message: 'Invalid refresh token' };
        }

        const newTokens = generateTokens(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newTokens.refreshToken },
        });

        res.cookie('refresh_token', newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ token: newTokens.accessToken });
    } catch (err) {
        next(err);
    }
};
