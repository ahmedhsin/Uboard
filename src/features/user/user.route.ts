import { Router } from "express";
import * as userController from './user.controller'
import {validate} from './utils/user.validators'
const router = Router()

router.get('/users', userController.getUsersController);

router.get('/users/:user_id', validate('getUser'), userController.getUserController);

router.post('/users', validate('createUser'), userController.createUserController);

router.put('/users/:user_id', validate('updateUser'), userController.updateUserController);

router.delete('/users/:user_id', validate('deleteUser'), userController.deleteUserController);

export default router;