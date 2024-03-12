import { Router } from "express";
import * as taskController from './task.controller'
const router = Router()

router.get('/tasks', taskController.getTasksController);

router.get('/tasks/:task_id', taskController.getTaskController);

router.post('/tasks', taskController.createTaskController);

router.put('/tasks/:task_id', taskController.updateTaskController);


router.delete('/tasks/:task_id', taskController.deleteTaskController);

router.post('/tasks/:task_id/favored_by', taskController.addFavoredUserController);

router.delete('/tasks/:task_id/favored_by/:user_id', taskController.removeFavoredUserController);

export default router;