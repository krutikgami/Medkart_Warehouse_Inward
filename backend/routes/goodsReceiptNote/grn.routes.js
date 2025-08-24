import {Router} from 'express'
import { addGrn,getAllGrns,deleteGrn,editGrn} from '../../controllers/goodsReceiptNote/grn.contoller.js';

const router = Router();

router.post('/add-grn',addGrn);
router.get('/get-all-grns',getAllGrns);
router.delete('/delete-grn',deleteGrn);
router.put('/edit-grn',editGrn);

export default router;
