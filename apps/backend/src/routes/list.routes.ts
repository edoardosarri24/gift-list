import { Router } from 'express';
import { authenticateJWT, authenticateGuest } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import { CreateGiftListSchema, GuestAccessSchema } from '@gift-list/shared';
import {
    getCelebrantLists,
    createList,
    getListManage,
    deleteList,
    createGuestAccess,
    getListPublic
} from '../controllers/list.controller';

const router = Router();

// Guest Routes
router.post('/:slug/access', validateBody(GuestAccessSchema), createGuestAccess);
router.get('/:slug', authenticateGuest, getListPublic);
// router.get('/:slug/my-claims', authenticateGuest, getMyClaims);

// Celebrant Routes
router.get('/', authenticateJWT, getCelebrantLists);
router.post('/', authenticateJWT, validateBody(CreateGiftListSchema), createList);
router.get('/:slug/manage', authenticateJWT, getListManage);
router.delete('/:id', authenticateJWT, deleteList);
// router.post('/:id/item', authenticateJWT, validateBody(CreateGiftItemSchema), addItem);

export default router;
