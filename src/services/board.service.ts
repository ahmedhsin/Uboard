import { Types } from "mongoose";
import IBoard from "../interfaces/board.interface";
import Board from '../models/board.model'
import { getUserById, getUserByUsername, updateUser } from "../services/user.service";
import bcrypt from 'bcrypt'
import { IUpdateData, IUpdateQuery, addUpdateQuery, createUpdateQuery } from "../interfaces/update.interface";

async function getBoards(limit: number=10, skip: number=0): Promise<IBoard[]> {
    return await Board.find()
    .limit(limit)
    .skip(skip)
    .populate({
        path: 'topic_ids',
    })
    .exec();
}

async function getBoardsByUserName(username: string, limit: number=10, skip: number=0): Promise<IBoard[] | null> {
    const user = await getUserByUsername(username);
    if (!user) throw new Error("author username is not related to a user");
    return await Board.find({author_id: user._id})
    .limit(limit)
    .skip(skip)
    .populate({
        path: 'topic_ids',
    })
    .exec()
}

async function getBoardById(board_id: Types.ObjectId): Promise<IBoard | null> {
    return await Board.findById(board_id)
    .populate({
        path: 'topic_ids',
    })
    .exec();
}



async function createBoard(boardData: IBoard): Promise<IBoard> {
    const authorId = boardData.author_id
    const user = await getUserById(authorId)
    if (!user) throw new Error("author id is not related to a user")
    if (boardData.key){
        const salt = await bcrypt.genSalt();
        const hashedKey = await bcrypt.hash(boardData.key, salt)
        boardData.key = hashedKey
    }
    const board = new Board(boardData)
    const boardObj = await board.save();
    updateUser(authorId, {
        array_operation: {
            field: "boards",
            key: "add",
            value: boardObj._id
        }
    })
    return boardObj
}

async function updateBoard(boardId: Types.ObjectId, updatedData: IUpdateData): Promise<IBoard | null> {
    const board = await getBoardById(boardId)
    if (!board) throw new Error("board is not found")
    const dataCols = ['title', 'description', 'category', 'public', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    
    const updatedBoard = await Board.findOneAndUpdate(
    { _id: boardId }, updateQuery, { new: true }).select('-key').exec();
    return updatedBoard
}

async function deleteBoard(boardId: Types.ObjectId): Promise<boolean> {
    const result = await Board.deleteOne({_id: boardId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

async function getBoardMembers(boardId: Types.ObjectId, limit: number=10, skip: number=0): Promise<Types.ObjectId[] | undefined> {
    const board = await Board.findById(boardId).populate({
        path: 'member_ids',
        options: {
            limit: limit,
            skip: skip
        }
    }).exec();
    if(!board) throw new Error("board is not found")
    return board.member_ids 
}

async function getFavoredUsers(boardId: Types.ObjectId, limit: number=10, skip: number=0): Promise<Types.ObjectId[] | undefined> {
    const board = await Board.findById(boardId).populate({
        path: 'favored_by_ids',
        options: {
            limit: limit,
            skip: skip
        }
    }).exec();
    if(!board) throw new Error("board is not found")
    return board.favored_by_ids;
}


async function addMemberToBoard(boardId: Types.ObjectId, memberId: Types.ObjectId): Promise<IBoard | null> {
    const board = await getBoardById(boardId);
    const user = await getUserById(memberId)
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("member is not found")
    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { $push: { member_ids: memberId } },
        { new: true }
    ).select('-key').exec();
    const updateUser_ = await updateUser(memberId, {
        array_operation: {
            field: "boards",
            key: "add",
            value: boardId
        }
    })
    return updatedBoard
}

async function removeMemberFromBoard(boardId: Types.ObjectId, memberId: Types.ObjectId): Promise<IBoard | null> {
    const board = await getBoardById(boardId);
    const user = await getUserById(memberId)
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("member is not found")
    const updatedBoard = await Board.findOneAndUpdate(
        { _id: boardId },
        { $pull: { member_ids: memberId } },
        { new: true }
    ).select('-key').exec();
    const updateUser_ = await updateUser(memberId, {
        array_operation: {
            field: "boards",
            key: "remove",
            value: boardId
        }
    })
    return updatedBoard
}

async function addFavoredUser(boardId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserById(userId);
    const board = await getBoardById(boardId);
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateBoard(boardId, {
        array_operation: {
            field: "favored_by_ids",
            key: "add",
            value: userId
        }
    })
    await updateUser(userId, {
        array_operation: {
            field: "fav_boards",
            key: "add",
            value: boardId
        }
    })
    return true;
}

async function removeFavoredUser(boardId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserById(userId);
    const board = await getBoardById(boardId);
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateBoard(boardId, {
        array_operation: {
            field: "favored_by_ids",
            key: "remove",
            value: userId
        }
    })
    await updateUser(userId, {
        array_operation: {
            field: "fav_boards",
            key: "remove",
            value: boardId
        }
    })
    return true;
}



export {
    getBoardsByUserName,
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    getBoardMembers,
    addMemberToBoard,
    removeMemberFromBoard,
    addFavoredUser,
    removeFavoredUser,
    getFavoredUsers
};

