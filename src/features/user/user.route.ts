import { Router } from "express";
import * as userController from './user.controller'
const router = Router()

router.get('/users', userController.getUsersController);

router.get('/users/:user_id', userController.validate('getUser'), userController.getUserController);

router.post('/users', userController.validate('createUser'), userController.createUserController);

router.put('/users/:user_id', userController.validate('updateUser'), userController.updateUserController);

router.delete('/users/:user_id', userController.validate('deleteUser'), userController.deleteUserController);

export default router;