import { Response, Request } from "express";
import * as taskService from './task.service'
import { IUpdateData } from "../utils/update.interface";
import ITask from "./task.interface";
import { Types } from "mongoose";
import { handelValidation } from "../utils/common.validators";


async function getTasksController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const tasks = await taskService.getTasksService()
        res.json(tasks)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getTaskController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const id = req.params.task_id
        const task = await taskService.getTaskService(new Types.ObjectId(id));
        if (!task) throw new Error('Task not found');
        res.json(task)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createTaskController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const taskData: ITask = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            author_id: reqBody.author_id,
            board_id: reqBody.board_id,
            parent_topic_id: reqBody.parent_topic_id,
            start_date: reqBody.start_date,
            end_date: reqBody.end_date
        }
        const task = await taskService.createTaskService(taskData)
        res.status(201).json({id: task._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateTaskController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const {task_id} = req.params;
        const data: IUpdateData = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            end_date: reqBody.end_date,
            notify: reqBody.notify,
            finished: reqBody.finished,
            content: reqBody.content,
        }
        const task = await taskService.updateTaskService(new Types.ObjectId(task_id), data);
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteTaskController(req: Request, res: Response): Promise<void> {
    const taskId = new Types.ObjectId(req.params.task_id);
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const val = await taskService.deleteTaskService(taskId);
        if (val)
            res.sendStatus(204);
        else
            res.sendStatus(404);
    }catch(error: any){
        res.status(400).json(error.message);
    }
}

async function addFavoredUserController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {task_id} = req.params;
        const {userId} = req.body;
        await taskService.addFavoredUserService(new Types.ObjectId(task_id), new Types.ObjectId(userId));
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}
async function removeFavoredUserController(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {task_id, user_id} = req.params;
        await taskService.removeFavoredUserService(new Types.ObjectId(task_id), new Types.ObjectId(user_id));
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}
export {
    getTasksController,
    getTaskController,
    createTaskController,
    updateTaskController,
    deleteTaskController,
    addFavoredUserController,
    removeFavoredUserController
}
