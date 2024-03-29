import { Router } from "express";
import * as userController from '../controllers/user.controller'
import {validate} from '../middlewares/user.validators'
const router = Router({mergeParams: true})

router
    .get('/', userController.getUsers)
    .post('/', userController.createUser);

router
    .get('/:user_id', userController.getUser)
    .put('/:user_id', userController.updateUser)
    .delete('/:user_id', userController.deleteUser);

export default router;