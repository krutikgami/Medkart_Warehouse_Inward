import {Router} from 'express'
import {getTotalCount} from '../controllers/totalCount.controller.js'

const router = Router();

router.get('/total-counts', getTotalCount)

export default router;