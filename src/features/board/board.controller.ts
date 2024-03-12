import { Response, Request } from "express";
import * as boardService from './board.service'
import IBoard from "./board.interface";
import { IUpdateData } from "../helpers/update.interface";
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
        const board = await boardService.getBoardService(id)
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
        res.sendStatus(201);
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
        const board = await boardService.updateBoardService(board_id, data);
        res.sendStatus(200);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

function deleteBoardController(req: Request, res: Response): void {
    throw Error("Not Implemented Yet")
}

async function getBoardMembersController(req: Request, res: Response): Promise<void> {
    try{
        const boardId = req.params.board_id
        const members = await boardService.getBoardMembersService(boardId);
        res.json(members)
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function addMemberToBoardController(req: Request, res: Response): Promise<void> {
    try{
        const {board_id} = req.params
        const {member_id} = req.body
        const board = await boardService.addMemberToBoardService(board_id, member_id);
        res.status(200).json(board);
    }catch(err: any){
        res.status(400).json(err.message);
    }
}

async function removeMemberFromBoardController(req: Request, res: Response): Promise<void> {
    try{
        const {board_id, member_id} = req.params
        const board = await boardService.removeMemberFromBoardService(board_id, member_id);
        res.status(200).json(board);
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
    removeMemberFromBoardController
}
