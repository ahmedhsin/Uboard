import { Response, Request } from "express";
import * as boardService from '../services/board.service'
import IBoard from "../interfaces/board.interface";
import { IUpdateData } from "../interfaces/update.interface";
import { Types } from "mongoose";
import { handelValidation } from "../middlewares/common.validators.middleware";
async function getBoards(req: Request, res: Response): Promise<void> {
    try{
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const boards = await boardService.getBoards(limit, skip)
        res.json(boards)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getBoardsByUserName(req: Request, res: Response): Promise<void> {
    try{
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const username = req.params.username;
        const boards = await boardService.getBoardsByUserName(username, limit, skip)
        res.json(boards)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}


async function getBoard(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const id = req.params.board_id
        const board = await boardService.getBoardById(new Types.ObjectId(id));
        if (!board) throw new Error('Board not found');
        res.json(board)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createBoard(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const boardData: IBoard = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            public: reqBody.public,
            author_id: req.user?._id
        }
        const board = await boardService.createBoard(boardData);
        res.status(201).json({id: board._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateBoard(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const reqBody = req.body;
        const {board_id} = req.params;
        const data: IUpdateData = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            public: reqBody.public,
        }
        const board = await boardService.updateBoard(new Types.ObjectId(board_id), data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteBoard(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const boardId = new Types.ObjectId(req.params.board_id);
        const val = await boardService.deleteBoard(boardId);
        if (val)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    }catch(error: any){
        res.status(400).json(error.message);
    }
}

async function getBoardMembers(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
        const boardId = req.params.board_id
        const members = await boardService.getBoardMembers(new Types.ObjectId(boardId), limit, skip);
        res.json(members)
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function addMemberToBoard(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {board_id} = req.params
        const {member_id} = req.body
        const board = await boardService.addMemberToBoard(new Types.ObjectId(board_id), member_id);
        res.status(200).json(board);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function removeMemberFromBoard(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {board_id, member_id} = req.params
        const board = await boardService.removeMemberFromBoard(new Types.ObjectId(board_id),
        new Types.ObjectId(member_id));
        res.status(200).json(board);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function addFavoredUser(req: Request, res: Response): Promise<void> {
    try{
        const errors = handelValidation(req);
        if (errors.length > 0){
            res.status(400).json(errors);
            return;
        }
        const {board_id} = req.params;
        const user_id = req.user?._id;
        await boardService.addFavoredUser(new Types.ObjectId(board_id), new Types.ObjectId(user_id));
        res.sendStatus(200);
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
        const {board_id} = req.params;
        const user_id = req.user?._id;
        await boardService.removeFavoredUser(new Types.ObjectId(board_id), new Types.ObjectId(user_id));
        res.sendStatus(200);
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
        const {board_id} = req.params;
        const data = await boardService.getFavoredUsers(new Types.ObjectId(board_id));
        res.json(data);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}


export {
    getBoards,
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardMembers,
    addMemberToBoard,
    removeMemberFromBoard,
    addFavoredUser,
    removeFavoredUser,
    getFavoredUsers,
    getBoardsByUserName
}
