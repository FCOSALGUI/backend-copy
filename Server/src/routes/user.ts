import { Router } from 'express';
import { getUsers, loginUser, newUser, getType, getUsernameById, getUserInfo,editUserInfo } from '../controllers/user';
import validateToken from './validate-token';
const router = Router();

router.post('/', newUser);
router.post('/login', loginUser)
router.get('/display/all', getUsers)
router.get('/type', validateToken,getType)
router.get('/userInfo/:id', validateToken, getUsernameById)
router.get('/userInfoID/', validateToken, getUserInfo)
router.put('/editInfo/', validateToken, editUserInfo)

export default router;