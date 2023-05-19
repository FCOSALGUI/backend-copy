import { Router } from 'express';
import validateToken from './validate-token';
import { createHistorial, getHistoriales } from '../controllers/historial';

const router = Router();

router.get('/all/:id', validateToken, getHistoriales)
router.post('/create/:id', validateToken, createHistorial)

export default router;