import { Response, Request } from "express";
import * as taskService from '../services/task.service'
import { IUpdateData } from "../interfaces/update.interface";
import ITask from "../interfaces/task.interface";
import { Types } from "mongoose";
import { handelValidation } from "../middlewares/common.validators.middleware";


async function getTasks(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
    if (req.params.topic_id) res.json(await taskService.getTasksByTopicId(new Types.ObjectId(req.params.topic_id)))
    else res.json(await taskService.getTasks())
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getTask(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const id = req.params.task_id
        const task = await taskService.getTaskById(new Types.ObjectId(id));
        if (!task) throw new Error('Task not found');
        res.json(task)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createTask(req: Request, res: Response): Promise<void> {
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
            author_id: req.user?._id,
            board_id: req.params.board_id || reqBody.board_id,
            parent_topic_id: req.params.topic_id || reqBody.parent_topic_id,
            start_date: reqBody.start_date,
            end_date: reqBody.end_date
        }
        const task = await taskService.createTask(taskData)
        res.status(201).json({id: task._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateTask(req: Request, res: Response): Promise<void> {
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
        const task = await taskService.updateTask(new Types.ObjectId(task_id), data);
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteTask(req: Request, res: Response): Promise<void> {
    const taskId = new Types.ObjectId(req.params.task_id);
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const val = await taskService.deleteTask(taskId);
        if (val)
            res.sendStatus(204);
        else
            res.sendStatus(404);
    }catch(error: any){
        res.status(400).json(error.message);
    }
}

async function addFavoredUser(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {task_id} = req.params;
        const userId = req.user?._id;
        await taskService.addFavoredUser(new Types.ObjectId(task_id), userId);
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}
async function removeFavoredUser(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {task_id} = req.params;
        const user_id = req.user?._id;
        await taskService.removeFavoredUser(new Types.ObjectId(task_id), user_id);
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function getFavoredUsers(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {task_id} = req.params;
        const data = await taskService.getFavoredUsers(new Types.ObjectId(task_id));
        res.json(data);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}


export {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addFavoredUser,
    removeFavoredUser,
    getFavoredUsers
}
