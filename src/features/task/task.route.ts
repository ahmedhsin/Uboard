import { Router } from "express";
import * as taskController from './task.controller'
import { validate } from "./utils/task.validators";
const router = Router()

router.get('/tasks', taskController.getTasksController);

router.get('/tasks/:task_id', validate('getTask'), taskController.getTaskController);

router.post('/tasks', validate('createTask'), taskController.createTaskController);

router.put('/tasks/:task_id', validate('updateTask'), taskController.updateTaskController);


router.delete('/tasks/:task_id', validate('deleteTask'), taskController.deleteTaskController);

router.post('/tasks/:task_id/favored_by', validate('addFavoredUser'), taskController.addFavoredUserController);

router.delete('/tasks/:task_id/favored_by/:user_id', validate('removeFavoredUser'), taskController.removeFavoredUserController);

export default router;