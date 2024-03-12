import { Types } from "mongoose";
import IBoard from "./board.interface";
import Board from './board.model'
import { getUserService, updateUserService } from "../user/user.service";
import bcrypt from 'bcrypt'
import { IUpdateData, IUpdateQuery, addUpdateQuery } from "../helpers/update.interface";
async function getBoardsService(): Promise<IBoard[]> {
    return await Board.find().select('-key').exec();
}

async function getBoardService(boardId: string): Promise<IBoard | null> {
    return await Board.findById(boardId).select('-key').exec();
}

async function createBoardService(boardData: IBoard): Promise<IBoard> {
    const authorId = boardData.author_id
    const user = await getUserService(String(authorId))
    if (!user) throw new Error("author id is not related to a user")
    if (boardData.key){
        const salt = await bcrypt.genSalt();
        const hashedKey = await bcrypt.hash(boardData.key, salt)
        boardData.key = hashedKey
    }
    const board = new Board(boardData)
    const boardObj = await board.save();
    updateUserService(String(authorId), {
        array_operation: {
            field: "boards",
            key: "add",
            value: boardObj._id
        }
    })
    return boardObj
}

async function updateBoardService(boardId: string, updatedData: IUpdateData): Promise<IBoard | null> {
    const board = await getBoardService(boardId)
    if (!board) throw new Error("board is not found")
    const updateQuery: IUpdateQuery = {
        $set: {},
        $pull: {},
        $push:{}
    }
    // todo make it generic and secure
    if (updatedData.title)
        addUpdateQuery(updateQuery, 'title', updatedData.title)
    if (updatedData.description)
        addUpdateQuery(updateQuery, 'description', updatedData.description)
    if (updatedData.category)
        addUpdateQuery(updateQuery, 'category', updatedData.category)
    if (updatedData.public)
        addUpdateQuery(updateQuery, 'public', updatedData.public)
    if (updatedData.array_operation)
        addUpdateQuery(updateQuery, 'array_operation', updatedData.array_operation)
    const updatedBoard = await Board.findOneAndUpdate(
    { _id: boardId }, updateQuery, { new: true }).select('-key').exec();
    return updatedBoard
}

function deleteBoardService(boardId: Types.ObjectId): void {
    throw Error("Not Implemented Yet");
}

async function getBoardMembersService(boardId: string): Promise<Types.ObjectId[] | undefined> {
    const members = await Board.findById(boardId).select('member_ids').exec();
    if(!members) throw new Error("board is not found")
    return members.member_ids 
}

async function addMemberToBoardService(boardId: string, memberId: string): Promise<IBoard | null> {
    const board = getBoardService(boardId);
    const user = getUserService(memberId)
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("member is not found")
    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { $push: { member_ids: memberId } },
        { new: true }
    ).select('-key').exec();
    return updatedBoard
}

async function removeMemberFromBoardService(boardId: string, memberId: string): Promise<IBoard | null> {
    const board = getBoardService(boardId);
    const user = getUserService(memberId)
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("member is not found")
    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { $pull: { member_ids: memberId } },
        { new: true }
    ).select('-key').exec();
    return updatedBoard
}

export {
    getBoardsService,
    getBoardService,
    createBoardService,
    updateBoardService,
    deleteBoardService,
    getBoardMembersService,
    addMemberToBoardService,
    removeMemberFromBoardService
};
