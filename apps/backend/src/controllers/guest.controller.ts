import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { ErrorCodes } from '@gift-list/shared';

export const claimItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = req.params.id;
        const guestId = (req as any).guest.id;

        // Transaction to prevent race conditions
        await prisma.$transaction(async (tx) => {
            // 1. Lock the specific Item row
            // We use a raw query because Prisma's specific locking mechanism is tricky to compose without direct raw
            const itemRow = await tx.$queryRaw<any[]>`SELECT status FROM "GiftItem" WHERE id = ${itemId} FOR UPDATE`;

            if (!itemRow || itemRow.length === 0) {
                throw { status: 404, code: ErrorCodes.ITEM_NOT_FOUND, message: 'Item not found' };
            }

            const item = await tx.giftItem.findUnique({ where: { id: itemId } });
            if (!item || item.deletedAt) throw { status: 404, code: ErrorCodes.ITEM_NOT_FOUND, message: 'Item not found' };
            if (item.status === 'CLAIMED') throw { status: 409, code: ErrorCodes.ITEM_ALREADY_CLAIMED, message: 'Item already claimed' };

            // Make the claim
            await tx.guestClaim.create({
                data: { itemId, guestId }
            });

            // Update item status
            await tx.giftItem.update({
                where: { id: itemId },
                data: { status: 'CLAIMED' }
            });
        });

        res.json({ success: true, status: 'CLAIMED' });
    } catch (err) {
        next(err);
    }
};

export const unclaimItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = req.params.id;
        const guestId = (req as any).guest.id;

        const claim = await prisma.guestClaim.findUnique({ where: { itemId } });

        if (!claim) {
            throw { status: 400, code: ErrorCodes.VALIDATION_ERROR, message: 'Item is not claimed' };
        }

        if (claim.guestId !== guestId) {
            throw { status: 403, code: ErrorCodes.ITEM_NOT_CLAIMED_BY_YOU, message: 'Not claimed by you' };
        }

        await prisma.$transaction(async (tx) => {
            await tx.guestClaim.delete({ where: { itemId } });
            await tx.giftItem.update({
                where: { id: itemId },
                data: { status: 'AVAILABLE' }
            });
        });

        res.json({ success: true, status: 'AVAILABLE' });
    } catch (err) {
        next(err);
    }
};
