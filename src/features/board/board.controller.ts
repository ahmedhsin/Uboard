import { Response, Request } from "express";
import * as boardService from './board.service'
import IBoard from "./board.interface";
import { IUpdateData } from "../helpers/update.interface";
import { Types } from "mongoose";
async function getBoardsController(req: Request, res: Response): Promise<void> {
    try{
        const boards = await boardService.getBoardsService()
        res.json(boards)
    }catch(err: any){
        res.status(503).json(err.message);
    }
}

async function getBoardController(req: Request, res: Response): Promise<void> {
    try{
        const id = req.params.board_id
        const board = await boardService.getBoardService(new Types.ObjectId(id))
        res.json(board)
    }catch(err: any){
        res.status(404).json(err.message);
    }
}

async function createBoardController(req: Request, res: Response): Promise<void> {
    try{
        const reqBody = req.body;
        const boardData: IBoard = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            public: reqBody.public,
            author_id: reqBody.author_id,
            key: reqBody.key
        }
        const board = await boardService.createBoardService(boardData);
        res.status(201).json({id: board._id});
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function updateBoardController(req: Request, res: Response): Promise<void> {
    try{
        const reqBody = req.body;
        const {board_id} = req.params;
        const data: IUpdateData = {
            title: reqBody.title,
            description: reqBody.description,
            category: reqBody.category,
            public: reqBody.public,
        }
        const board = await boardService.updateBoardService(new Types.ObjectId(board_id), data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function deleteBoardController(req: Request, res: Response): Promise<void> {
    const boardId = new Types.ObjectId(req.params.board_id);
    try{
        const val = await boardService.deleteBoardService(boardId);
        if (val)
            res.sendStatus(204);
        else
            res.sendStatus(404);
    }catch(error: any){
        res.status(400).json(error.message);
    }
}

async function getBoardMembersController(req: Request, res: Response): Promise<void> {
    try{
        const boardId = req.params.board_id
        const members = await boardService.getBoardMembersService(new Types.ObjectId(boardId));
        res.json(members)
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function addMemberToBoardController(req: Request, res: Response): Promise<void> {
    try{
        const {board_id} = req.params
        const {member_id} = req.body
        const board = await boardService.addMemberToBoardService(new Types.ObjectId(board_id), member_id);
        res.status(200).json(board);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function removeMemberFromBoardController(req: Request, res: Response): Promise<void> {
    try{
        const {board_id, member_id} = req.params
        const board = await boardService.removeMemberFromBoardService(new Types.ObjectId(board_id),
        new Types.ObjectId(member_id));
        res.status(200).json(board);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

function addFavoredUserController(req: Request, res: Response): void {
    try{
        const {board_id} = req.params;
        const {userId} = req.body;
        boardService.addFavoredUserService(new Types.ObjectId(board_id), new Types.ObjectId(userId));
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}
function removeFavoredUserController(req: Request, res: Response): void{
    try{
        const {board_id, user_id} = req.params;
        boardService.removeFavoredUserService(new Types.ObjectId(board_id), new Types.ObjectId(user_id));
        res.sendStatus(204);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}


export {
    getBoardsController,
    getBoardController,
    createBoardController,
    updateBoardController,
    deleteBoardController,
    getBoardMembersController,
    addMemberToBoardController,
    removeMemberFromBoardController,
    addFavoredUserController,
    removeFavoredUserController
}
