import { Router } from 'express';
import validateToken from './validate-token';
import { createComment, getComments } from '../controllers/comment';

const router = Router();

router.get('/all/:id', validateToken, getComments)
router.post('/create/:id', validateToken,createComment)

export default router;
