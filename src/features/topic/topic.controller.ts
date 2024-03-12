import { Response, Request } from "express";
import * as topicService from './topic.service'
import { IUpdateData } from "../helpers/update.interface";
import Topic from "./topic.model";
import ITopic from "./topic.interface";
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
        const id = req.params.topic_id
        const topic = await topicService.getTopicService(id);
        res.json(topic)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createTopicController(req: Request, res: Response): Promise<void> {
    try{
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
        res.sendStatus(201);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateTopicController(req: Request, res: Response): Promise<void> {
    try{
        const reqBody = req.body;
        const {topic_id} = req.params;
        const data: IUpdateData = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
        }
        const topic = await topicService.updateTopicService(topic_id, data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

function deleteTopicController(req: Request, res: Response): void {
    throw Error("Not Implemented Yet")
}


export {
    getTopicsController,
    getTopicController,
    createTopicController,
    updateTopicController,
    deleteTopicController,
}
