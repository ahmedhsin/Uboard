import { Types } from "mongoose";
import ITask from "../interfaces/task.interface";
import Task from '../models/task.model'
import { IUpdateData, IUpdateQuery, addUpdateQuery, createUpdateQuery } from "../interfaces/update.interface";
import { getBoardById } from "../services/board.service";
import { getUserById, updateUser } from "../services/user.service";
import { getTopicById, updateTopic } from "../services/topic.service";

async function getTasks(limit: number = 10, skip: number = 0){
    return await Task.find().limit(limit).skip(skip).exec();
}

async function getTasksByTopicId(topic_id: Types.ObjectId, limit: number = 10, skip: number = 0): Promise<ITask[]> {
    return await Task.find({parent_topic_id: topic_id}).limit(limit).skip(skip).exec()
}

async function getTasksByBoardId(board_id: Types.ObjectId, limit: number = 10, skip: number = 0): Promise<ITask[]> {
   return await Task.find({board_id: board_id}).limit(limit).skip(skip).exec()
}

async function getTaskById(taskId: Types.ObjectId): Promise<ITask | null> {
    return await Task.findById(taskId)
}

async function createTask(taskData: ITask): Promise<ITask> {
    const {author_id, board_id, parent_topic_id} = taskData
    const user = await getUserById(author_id)
    const board = await getBoardById(board_id);
    const topic = await getTopicById(parent_topic_id);
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    if (!topic) throw new Error("parent topic is not found")
    if(topic.content_type === 'Topic') throw Error("parent topic hold only topics")
    const task = new Task(taskData)
    const taskObj =  await task.save();
    await updateTopic(taskData.parent_topic_id, {
        array_operation: {
            field: "has",
            key: "add",
            value: taskObj._id
        },
        content_type: "Task"
    })
    return taskObj;
}

async function updateTask(taskId: Types.ObjectId, updatedData: IUpdateData): Promise<ITask | null> {
    const task = await getTaskById(taskId)
    if (!task) throw new Error("task is not found")
    // todo make it generic and secure
    const dataCols = ['title', 'description', 'category', 'end_date', 'notify', 'finished', 'content', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    const updatedtask = await Task.findOneAndUpdate(
    { _id: taskId }, updateQuery, { new: true });
    return updatedtask
}


async function deleteTask(taskId: Types.ObjectId): Promise<boolean> {
    const result = await Task.deleteOne({_id: taskId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

async function addFavoredUser(taskId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserById(userId);
    const task = await getTaskById(taskId);
    if (!task) throw new Error("task is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTask(taskId, {
        array_operation: {
            field: "favored_by_ids",
            key: "add",
            value: userId
        }
    })
    await updateUser(userId, {
        array_operation: {
            field: "fav_tasks",
            key: "add",
            value: taskId
        }
    })
    return true;
}

async function removeFavoredUser(taskId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserById(userId);
    const task = await getTaskById(taskId);
    if (!task) throw new Error("task is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTask(taskId, {
        array_operation: {
            field: "favored_by_ids",
            key: "remove",
            value: userId
        }
    })
    await updateUser(userId, {
        array_operation: {
            field: "fav_tasks",
            key: "remove",
            value: taskId
        }
    })
    return true;
}

async function getFavoredUsers(taskId: Types.ObjectId, limit: number=10, skip: number=0): Promise<Types.ObjectId[] | undefined> {
    const task = await Task.findById(taskId).populate({
        path: 'favored_by_ids',
        options: {
            limit: limit,
            skip: skip
        }
    }).exec();
    if(!task) throw new Error("task is not found")
    return task.favored_by_ids;
}

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    addFavoredUser,
    removeFavoredUser,
    getFavoredUsers,
    getTasksByTopicId,
    getTasksByBoardId

}
