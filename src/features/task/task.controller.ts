import { Response, Request } from "express";
import * as taskService from './task.service'
import { IUpdateData } from "../helpers/update.interface";
import ITask from "./task.interface";


async function getTasksController(req: Request, res: Response): Promise<void> {
    try{
        const tasks = await taskService.getTasksService()
        res.json(tasks)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getTaskController(req: Request, res: Response): Promise<void> {
    try{
        const id = req.params.task_id
        const task = await taskService.getTaskService(id);
        res.json(task)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createTaskController(req: Request, res: Response): Promise<void> {
    try{
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
        res.sendStatus(201);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateTaskController(req: Request, res: Response): Promise<void> {
    try{
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
        const task = await taskService.updateTaskService(task_id, data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

function deleteTaskController(req: Request, res: Response): void {
    throw Error("Not Implemented Yet")
}

function addFavoredUserController(req: Request, res: Response): void {
    throw Error("Not Implemented Yet")
}

function removeFavoredUserController(req: Request, res: Response): void {
    throw Error("Not Implemented Yet")
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
