import { Response, Request } from "express";
import * as topicService from './topic.service'
import { IUpdateData } from "../utils/update.interface";
import Topic from "./topic.model";
import ITopic from "./topic.interface";
import { Types } from "mongoose";
import { handelValidation } from "../utils/common.validators";
async function getTopicsController(req: Request, res: Response): Promise<void> {
    try{
        const topics = await topicService.getTopicsService()
        res.json(topics)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getTopicController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const id = req.params.topic_id
        const topic = await topicService.getTopicService(new Types.ObjectId(id));
        if (!topic) throw new Error('Topic not found');
        res.json(topic)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createTopicController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const topicData: ITopic = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            author_id: reqBody.author_id,
            board_id: reqBody.board_id,
            parent_topic_id: reqBody.parent_topic_id
        }
        const topic = await topicService.createTopicService(topicData)
        res.status(201).json({id: topic._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateTopicController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const {topic_id} = req.params;
        const data: IUpdateData = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
        }
        const topic = await topicService.updateTopicService(new Types.ObjectId(topic_id), data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteTopicController(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const topicId = new Types.ObjectId(req.params.topic);
        const val = await topicService.deleteTopicService(topicId);
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
        const {topic_id} = req.params;
        const {userId} = req.body;
        await topicService.addFavoredUserService(new Types.ObjectId(topic_id), new Types.ObjectId(userId));
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
        const {topic_id, user_id} = req.params;
        await topicService.removeFavoredUserService(new Types.ObjectId(topic_id), new Types.ObjectId(user_id));
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

export {
    getTopicsController,
    getTopicController,
    createTopicController,
    updateTopicController,
    deleteTopicController,
    addFavoredUserController,
    removeFavoredUserController
}


