import {Router } from 'express'
import {createPurchaseOrder,getAllPurchaseOrder,deletePurchaseOrder,updatePurchaseOrder,searchProduct,searchVendor} from '../../controllers/purchaseOrder/purchaseOrder.controller.js';
const router = Router();

router.post('/purchase-order', createPurchaseOrder);
router.get('/allPurchaseOrder', getAllPurchaseOrder);
router.delete('/delete-purchase-order', deletePurchaseOrder);
router.put('/update-purchase-order', updatePurchaseOrder);
router.get('/searchProduct',searchProduct);
router.get('/searchVendor',searchVendor);

export default router;
