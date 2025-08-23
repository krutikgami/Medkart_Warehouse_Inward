import {Router} from 'express'
import { addGrn } from '../../controllers/goodsReceiptNote/grn.contoller.js';

const router = Router();

router.post('/add-grn',addGrn);

export default router;
