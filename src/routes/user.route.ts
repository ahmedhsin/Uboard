import { Router } from "express";
import * as userController from '../controllers/user.controller'
import * as boardController from '../controllers/board.controller'
import {validate} from '../middlewares/user.validators'
const router = Router({mergeParams: true})

router
    .get('/me', userController.getCurrentUser)

router
    .get('/', userController.getUsers)
    .post('/', userController.createUser)
    .put('/', userController.updateUser)
    .delete('/', userController.deleteUser);

router
    .get('/:username', userController.getUserByUserName)
    .get('/:username/boards', boardController.getBoardsByUserName)


export default router;