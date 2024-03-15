import { Response, Request } from "express";
import * as userService from './user.service'
import IUser from "./user.interface";
import { Types } from "mongoose";
import { IUpdateData } from "../helpers/update.interface";
async function getUsersController(req: Request, res: Response): Promise<void> {
    try{
        const users = await userService.getUsersService()
        res.json(users)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}


async function getUserController(req: Request, res: Response): Promise<void>{
    try{
        const id = req.params.user_id
        const user = await userService.getUserService(new Types.ObjectId(id))
        res.json(user)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createUserController(req: Request, res: Response): Promise<void>{
    try{
        const reqBody = req.body;
        const userData: IUser = {
            username: reqBody.username,
            email: reqBody.email,
            first_name: reqBody.first_name,
            last_name: reqBody.last_name,
            password_hash: reqBody.password_hash
        }
        const user = await userService.createUserService(userData);
        res.status(201).json({id: user._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateUserController(req: Request, res: Response): Promise<void>{
    try{
        const reqBody = req.body;
        const {user_id} = req.params;
        const data: IUpdateData = {
            username: reqBody.username,
            email: reqBody.email,
            first_name: reqBody.first_name,
            last_name: reqBody.last_name,
        }
        const user = await userService.updateUserService(new Types.ObjectId(user_id), data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteUserController(req: Request, res: Response): Promise<void>{
    try{
        const isDeleted = await userService.deleteUserService(new Types.ObjectId(req.params.user_id));
        if (isDeleted){
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

export {
    getUserController,
    getUsersController,
    updateUserController,
    deleteUserController,
    createUserController
}