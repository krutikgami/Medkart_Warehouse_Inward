import {Router } from 'express'
import {getAllProducts,productMaster,deleteProduct,updateProduct} from '../../controllers/productMaster/productMaster.controller.js';
const router = Router();

router.post('/product', productMaster)
router.get('/all-products', getAllProducts);
router.delete('/delete-product', deleteProduct);
router.put('/update-product', updateProduct);

export default router;
