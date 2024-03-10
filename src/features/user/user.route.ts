import { Router } from "express";
import * as userController from './user.controller'
const router = Router()

router.get('/users', userController.getUsersController);

router.get('/users/:user_id', userController.getUserController);

router.post('/users', userController.createUserController);

router.put('/users/:user_id', userController.updateUserController);

router.delete('/users/:user_id', userController.deleteUserController);

export default router;