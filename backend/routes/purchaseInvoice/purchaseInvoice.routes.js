import  {Router} from 'express'
import {createPurchaseInvoice,deletePurchaseInvoice,getAllPurchaseInvoices,updatePurchaseInvoice} from '../../controllers/purchaseInvoice/purchaseInvoice.controller.js';

const router = Router();
router.post('/create-purchase-invoice',createPurchaseInvoice);
router.get('/getAll-purchase-invoices',getAllPurchaseInvoices);
router.put('/update-purchase-invoice',updatePurchaseInvoice);
router.delete('/delete-purchase-invoice',deletePurchaseInvoice);

export default router;