import { Router } from "express";
import * as userController from '../controllers/user.controller'
import * as boardController from '../controllers/board.controller'
import {validate} from '../middlewares/user.middleware'
const router = Router({mergeParams: true})

router
    .get('/me', validate('me'), userController.getCurrentUser)

router
    .get('/', userController.getUsers)
    .post('/', validate('createUser') , userController.createUser)
    .put('/', validate('updateUser')  , userController.updateUser)
    .delete('/', validate('deleteUser') , userController.deleteUser);

router
    .get('/:username', userController.getUserByUserName)
    .get('/:username/boards', boardController.getBoardsByUserName)


export default router;