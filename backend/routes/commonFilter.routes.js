import {Router} from 'express'
import { commonFilter } from '../controllers/commonSearch/commonFilter.controller.js'


const router = Router()

router.get('/commonFilter',commonFilter);

export default router