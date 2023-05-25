import { Router } from 'express';
import { getUsers, loginUser, newUser, getType, getUsernameById, getMyProfile, getUserById, editUserInfo } from '../controllers/user';
import validateToken from './validate-token';
const router = Router();

router.post('/', newUser);
router.post('/login', loginUser)
router.get('/display/all', getUsers)
router.get('/type', validateToken,getType)
router.get('/userName/:id', validateToken, getUsernameById)
router.get('/myInfo/', validateToken, getMyProfile)
router.get('/userInfoID/:id', validateToken, getUserById)
router.put('/editInfo/', validateToken, editUserInfo)

export default router;