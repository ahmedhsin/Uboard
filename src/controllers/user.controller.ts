import { Response, Request } from "express";
import * as userService from '../services/user.service'
import IUser from "../interfaces/user.interface";
import { Types } from "mongoose";
import { IUpdateData } from "../interfaces/update.interface";
import { handelValidation} from "../middlewares/common.validators.middleware";
async function getUsers(req: Request, res: Response): Promise<void> {
    try{
        const users = await userService.getUsers()
        res.json(users)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}


async function getUserByUserName(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const username = req.params.username
        const user = await userService.getUserByUsername(username);
        if (!user) throw new Error('User not found');
        res.json(user)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function getCurrentUser(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const username = req.user?.username
        const user = await userService.getUserByUsername(username);
        if (!user) throw new Error('User not found');
        res.json(user)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createUser(req: Request, res: Response): Promise<void>{
    try{  
        const reqBody = req.body;
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const userData: IUser = {
            username: reqBody.username,
            email: reqBody.email,
            first_name: reqBody.first_name,
            last_name: reqBody.last_name,
            password: reqBody.password
        }
        const user = await userService.createUser(userData);
        res.status(201).json({id: user._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateUser(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const user_id = req.user?._id;
        const data: IUpdateData = {
            username: reqBody.username,
            email: reqBody.email,
            first_name: reqBody.first_name,
            last_name: reqBody.last_name,
        }
        const user = await userService.updateUser(user_id, data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteUser(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const user_id = req.user?._id;
        const isDeleted = await userService.deleteUser(user_id);
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
    getUserByUserName,
    getCurrentUser,
    getUsers,
    updateUser,
    deleteUser,
    createUser,
}

