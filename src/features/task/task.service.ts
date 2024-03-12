import { Types } from "mongoose";
import ITask from "./task.interface";
import Task from './task.model'
import { IUpdateData, IUpdateQuery, addUpdateQuery } from "../helpers/update.interface";
import { getBoardService } from "../board/board.service";
import { getUserService } from "../user/user.service";
import { getTopicService, updateTopicService } from "../topic/topic.service";

async function getTasksService(): Promise<ITask[]> {
    return await Task.find();
}

async function getTaskService(taskId: string): Promise<ITask | null> {
    return await Task.findById(taskId)
}

async function createTaskService(taskData: ITask): Promise<ITask | null> {
    const {author_id, board_id, parent_topic_id} = taskData
    const user = await getUserService(String(author_id))
    const board = await getBoardService(String(board_id));
    const topic = await getTopicService(String(parent_topic_id));
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    if (!topic) throw new Error("parent topic is not found")
    if(topic.content_type === 'Topic') throw Error("parent topic hold only topics")
    const task = new Task(taskData)
    const taskObj =  await task.save();
    updateTopicService(String(taskData.parent_topic_id), {
        array_operation: {
            field: "has",
            key: "add",
            value: taskObj._id
        },
        content_type: "Task"
    })
    return taskObj;
}

async function updateTaskService(taskId: string, updatedData: IUpdateData): Promise<ITask | null> {
    const task = await getTaskService(taskId)
    if (!task) throw new Error("task is not found")
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
    if (updatedData.end_date)
        addUpdateQuery(updateQuery, 'end_date', updatedData.end_date)
    if (updatedData.notify)
        addUpdateQuery(updateQuery, 'notify', updatedData.notify)
    if (updatedData.finished)
        addUpdateQuery(updateQuery, 'finished', updatedData.finished)
    if (updatedData.content)
        addUpdateQuery(updateQuery, 'content', updatedData.content)
    if (updatedData.array_operation)
        addUpdateQuery(updateQuery, 'array_operation', updatedData.array_operation)
    const updatedtask = await Task.findOneAndUpdate(
    { _id: taskId }, updateQuery, { new: true });
    return updatedtask
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
