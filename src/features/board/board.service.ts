import { Types } from "mongoose";
import IBoard from "./board.interface";

function getBoardsService(): IBoard[] {
    throw Error("Not Implemented Yet");
}

function getBoardService(boardId: Types.ObjectId): IBoard {
    throw Error("Not Implemented Yet");
}

function createBoardService(boardData: any): IBoard {
    throw Error("Not Implemented Yet");
}

function updateBoardService(boardId: Types.ObjectId, updatedData: any): IBoard {
    throw Error("Not Implemented Yet");
}

function deleteBoardService(boardId: Types.ObjectId): void {
    throw Error("Not Implemented Yet");
}

function getBoardMembersService(boardId: Types.ObjectId): any[] {
    throw Error("Not Implemented Yet");
}

function addMemberToBoardService(boardId: Types.ObjectId, memberId: Types.ObjectId): void {
    throw Error("Not Implemented Yet");
}

function removeMemberFromBoardService(boardId: Types.ObjectId, memberId: Types.ObjectId): void {
    throw Error("Not Implemented Yet");
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
