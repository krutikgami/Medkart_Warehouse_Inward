import {Router } from 'express'
import {addVendorMaster,getAllVendors,deleteVendor,updateVendor} from '../../controllers/vendorMaster/vendorMaster.controller.js';
const router = Router();

router.post('/vendor', addVendorMaster)
router.get('/all-vendors', getAllVendors);
router.delete('/delete-vendor', deleteVendor);
router.put('/update-vendor', updateVendor);

export default router;
