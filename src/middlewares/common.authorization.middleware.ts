import {NextFunction, Request, Response} from 'express';
import { getBoardById } from '../services/board.service';
import { ObjectId } from 'mongodb';

const isBoardOwner = async (req: Request, res: Response, next: any) => {
    const board_id = req.params.board_id || req.body.board_id;
    const board = await getBoardById(board_id);
    if (!board) return res.status(400).json({message: "Board not found"});
    if (req.user && req.user._id === board.author_id) {
        return next();
    }
    return res.status(401).json({message: "Unauthorized"});
}

const isBoardMemberOrOwner = async (req: Request, res: Response, next: any) => {
    const board_id = req.params.board_id || req.body.board_id;
    const board = await getBoardById(board_id);
    if (!board) return res.status(400).json({message: "Board not found"});
    if (req.user && req.user._id === board.author_id) {
        return next();
    } else if (req.user  && req.user._id && board.member_ids?.includes(req.user._id)) {
        return next();
    }
    return res.status(401).json({message: "Unauthorized"});
}

const isTopicOwner = (req: Request, res: Response, next: any) => {
    const topic_id = req.params.topic_id || req.body.topic_id;
    if (req.user && String(req.user._id) === topic_id) {
        return next();
    }
    return res.status(401).json({message: "Unauthorized"});
}

const isTaskOwner = (req: Request, res: Response, next: any) => {
    const task_id = req.params.task_id || req.body.task_id;
    if (req.user && String(req.user._id) === task_id) {
        return next();
    }
    return res.status(401).json({message: "Unauthorized"});
}
function isAuthenticated(req: Request ,res: Response, next: NextFunction): Response | void {
    if(req.user)
        return next();
    else
        return res.status(401).send("Unauthorized");
}

function isNotAuthenticated(req: Request ,res: Response, next: NextFunction): Response | void {
    if(!req.user)
        return next();
    else
        return res.status(401).send("Unauthorized");
}

export {isBoardOwner, isTopicOwner, isTaskOwner, isBoardMemberOrOwner, isAuthenticated, isNotAuthenticated};