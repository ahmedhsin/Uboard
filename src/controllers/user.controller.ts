import { Response, Request } from "express";
import * as userService from '../services/user.service'
import IUser from "../interfaces/user.interface";
import { Types } from "mongoose";
import { IUpdateData } from "../interfaces/update.interface";
import { handelValidation} from "../middlewares/common.validators";
async function getUsers(req: Request, res: Response): Promise<void> {
    try{
        const users = await userService.getUsers()
        res.json(users)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}


async function getUser(req: Request, res: Response): Promise<void>{
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const id = req.params.user_id
        const user = await userService.getUserById(new Types.ObjectId(id))
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
            password_hash: reqBody.password_hash
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
        const {user_id} = req.params;
        const data: IUpdateData = {
            username: reqBody.username,
            email: reqBody.email,
            first_name: reqBody.first_name,
            last_name: reqBody.last_name,
        }
        const user = await userService.updateUser(new Types.ObjectId(user_id), data);
        res.sendStatus(204);
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
        const isDeleted = await userService.deleteUser(new Types.ObjectId(req.params.user_id));
        if (isDeleted){
            res.sendStatus(204);
        }else{
            res.sendStatus(404);
        }
    }catch(err: any){
        res.status(400).json(err.message);
    }
}
export {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    createUser,
}

