import { Types } from "mongoose";
import IBoard from "./board.interface";
import Board from './board.model'
import { getUserService, updateUserService } from "../user/user.service";
import bcrypt from 'bcrypt'
import { IUpdateData, IUpdateQuery, addUpdateQuery, createUpdateQuery } from "../helpers/update.interface";
async function getBoardsService(): Promise<IBoard[]> {
    return await Board.find().select('-key').exec();
}

async function getBoardService(boardId: Types.ObjectId): Promise<IBoard | null> {
    return await Board.findById(boardId).select('-key').exec();
}

async function createBoardService(boardData: IBoard): Promise<IBoard> {
    const authorId = boardData.author_id
    const user = await getUserService(authorId)
    if (!user) throw new Error("author id is not related to a user")
    if (boardData.key){
        const salt = await bcrypt.genSalt();
        const hashedKey = await bcrypt.hash(boardData.key, salt)
        boardData.key = hashedKey
    }
    const board = new Board(boardData)
    const boardObj = await board.save();
    updateUserService(authorId, {
        array_operation: {
            field: "boards",
            key: "add",
            value: boardObj._id
        }
    })
    return boardObj
}

async function updateBoardService(boardId: Types.ObjectId, updatedData: IUpdateData): Promise<IBoard | null> {
    const board = await getBoardService(boardId)
    if (!board) throw new Error("board is not found")
    const dataCols = ['title', 'description', 'category', 'public', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    
    const updatedBoard = await Board.findOneAndUpdate(
    { _id: boardId }, updateQuery, { new: true }).select('-key').exec();
    return updatedBoard
}

async function deleteBoardService(boardId: Types.ObjectId): Promise<boolean> {
    const result = await Board.deleteOne({_id: boardId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

async function getBoardMembersService(boardId: Types.ObjectId): Promise<Types.ObjectId[] | undefined> {
    const board = await Board.findById(boardId)
    if(!board) throw new Error("board is not found")
    return board.member_ids 
}

async function addMemberToBoardService(boardId: Types.ObjectId, memberId: Types.ObjectId): Promise<IBoard | null> {
    const board = await getBoardService(boardId);
    const user = await getUserService(memberId)
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("member is not found")
    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { $push: { member_ids: memberId } },
        { new: true }
    ).select('-key').exec();
    return updatedBoard
}

async function removeMemberFromBoardService(boardId: Types.ObjectId, memberId: Types.ObjectId): Promise<IBoard | null> {
    const board = await getBoardService(boardId);
    const user = await getUserService(memberId)
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
