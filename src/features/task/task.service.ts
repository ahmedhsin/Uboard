import { Types } from "mongoose";
import ITask from "./task.interface";

function getTasksService(): ITask[] {
    throw Error("Not Implemented Yet")
}

function getTaskService(taskId: Types.ObjectId): ITask {
    throw Error("Not Implemented Yet")
}

function createTaskService(taskData: any): ITask {
    throw Error("Not Implemented Yet")
}

function updateTaskService(taskId: Types.ObjectId, taskData: any): boolean {
    throw Error("Not Implemented Yet")
}

function deleteTaskService(taskId: Types.ObjectId): boolean {
    throw Error("Not Implemented Yet")
}

function addFavoredUserService(taskId: Types.ObjectId, userId: Types.ObjectId): boolean {
    throw Error("Not Implemented Yet")
}

function removeFavoredUserService(taskId: Types.ObjectId, userId: Types.ObjectId): boolean {
    throw Error("Not Implemented Yet")
}

export {
    getTasksService,
    getTaskService,
    createTaskService,
    updateTaskService,
    deleteTaskService,
    addFavoredUserService,
    removeFavoredUserService
}
