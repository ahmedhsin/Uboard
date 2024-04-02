import { Router } from "express";
import * as taskController from '../controllers/task.controller'
import { validate } from "../middlewares/task.middleware";
const router = Router({mergeParams: true})

router
    .get('/', taskController.getTasks)
    .post('/', validate('createTask'), taskController.createTask);

router
    .get('/:task_id', validate('getTask'), taskController.getTask)
    .put('/:task_id', validate('updateTask'), taskController.updateTask)
    .delete('/:task_id', validate('deleteTask'), taskController.deleteTask);

router
    .get('/:task_id/favored_by', validate('getFavoredUsers'), taskController.getFavoredUsers)
    .post('/:task_id/favored_by', validate('addFavoredUser'), taskController.addFavoredUser)
    .delete('/:task_id/favored_by', validate('removeFavoredUser'), taskController.removeFavoredUser);

export default router;