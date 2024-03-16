import { Types } from "mongoose";
import ITask from "./task.interface";
import Task from './task.model'
import { IUpdateData, IUpdateQuery, addUpdateQuery, createUpdateQuery } from "../helpers/update.interface";
import { getBoardService } from "../board/board.service";
import { getUserService, updateUserService } from "../user/user.service";
import { getTopicService, updateTopicService } from "../topic/topic.service";

async function getTasksService(): Promise<ITask[]> {
    return await Task.find();
}

async function getTaskService(taskId: Types.ObjectId): Promise<ITask | null> {
    return await Task.findById(taskId)
}

async function createTaskService(taskData: ITask): Promise<ITask> {
    const {author_id, board_id, parent_topic_id} = taskData
    const user = await getUserService(author_id)
    const board = await getBoardService(board_id);
    const topic = await getTopicService(parent_topic_id);
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    if (!topic) throw new Error("parent topic is not found")
    if(topic.content_type === 'Topic') throw Error("parent topic hold only topics")
    const task = new Task(taskData)
    const taskObj =  await task.save();
    await updateTopicService(taskData.parent_topic_id, {
        array_operation: {
            field: "has",
            key: "add",
            value: taskObj._id
        },
        content_type: "Task"
    })
    return taskObj;
}

async function updateTaskService(taskId: Types.ObjectId, updatedData: IUpdateData): Promise<ITask | null> {
    const task = await getTaskService(taskId)
    if (!task) throw new Error("task is not found")
    // todo make it generic and secure
    const dataCols = ['title', 'description', 'category', 'end_date', 'notify', 'finished', 'content', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    const updatedtask = await Task.findOneAndUpdate(
    { _id: taskId }, updateQuery, { new: true });
    return updatedtask
}


async function deleteTaskService(taskId: Types.ObjectId): Promise<boolean> {
    const result = await Task.deleteOne({_id: taskId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

async function addFavoredUserService(taskId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserService(userId);
    const task = await getTaskService(taskId);
    if (!task) throw new Error("task is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTaskService(taskId, {
        array_operation: {
            field: "favored_by_ids",
            key: "add",
            value: userId
        }
    })
    await updateUserService(userId, {
        array_operation: {
            field: "fav_tasks",
            key: "add",
            value: taskId
        }
    })
    return true;
}

async function removeFavoredUserService(taskId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserService(userId);
    const task = await getTaskService(taskId);
    if (!task) throw new Error("task is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTaskService(taskId, {
        array_operation: {
            field: "favored_by_ids",
            key: "remove",
            value: userId
        }
    })
    await updateUserService(userId, {
        array_operation: {
            field: "fav_tasks",
            key: "remove",
            value: taskId
        }
    })
    return true;
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
