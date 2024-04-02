import { Response, Request } from "express";
import * as topicService from '../services/topic.service'
import { IUpdateData } from "../interfaces/update.interface";
import Topic from "../models/topic.model";
import ITopic from "../interfaces/topic.interface";
import { Types } from "mongoose";
import { handelValidation } from "../middlewares/common.validators.middleware";
async function getTopics(req: Request, res: Response): Promise<void> {
    try{
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        if (req.params.board_id){
            const topics = await topicService.getTopicsByBoardId(new Types.ObjectId(req.params.board_id), limit, skip)
            res.json(topics)
            return;
        }
        const topics = await topicService.getTopics(limit, skip)
        res.json(topics)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getTopicsByBoardId(req: Request, res: Response): Promise<void> {
    try{
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const topics = await topicService.getTopicsByBoardId(new Types.ObjectId(req.params.board_id), limit, skip)
        res.json(topics)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getTopic(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const id = req.params.topic_id
        const topic = await topicService.getTopicById(new Types.ObjectId(id));
        if (!topic) throw new Error('Topic not found');
        res.json(topic)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}



async function createTopic(req: Request, res: Response): Promise<void> {
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
            author_id: req.user?._id,
            board_id: req.params.board_id || reqBody.board_id,
            parent_topic_id: reqBody.parent_topic_id
        }
        const topic = await topicService.createTopic(topicData)
        res.status(201).json({id: topic._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateTopic(req: Request, res: Response): Promise<void> {
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
        const topic = await topicService.updateTopic(new Types.ObjectId(topic_id), data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteTopic(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const topicId = new Types.ObjectId(req.params.topic);
        const val = await topicService.deleteTopic(topicId);
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
        const {topic_id} = req.params;
        const userId = req.user?._id;
        await topicService.addFavoredUser(new Types.ObjectId(topic_id), userId);
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
        const {topic_id} = req.params;
        const user_id = req.user?._id;
        await topicService.removeFavoredUser(new Types.ObjectId(topic_id), user_id);
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
        const {topic_id} = req.params;
        const data = await topicService.getFavoredUsers(new Types.ObjectId(topic_id));
        res.json(data)
    }catch(err: any){
        res.status(400).json(err.message);
    }
}
export {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    addFavoredUser,
    removeFavoredUser,
    getTopicsByBoardId,
    getFavoredUsers
}


