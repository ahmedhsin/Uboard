import { Types } from "mongoose";
import ITopic from "../interfaces/topic.interface";
import Topic from "../models/topic.model";
import { getUserById, updateUser } from "../services/user.service";
import { getBoardById, updateBoard } from "../services/board.service";
import Board from "../models/board.model";
import { IUpdateData, IUpdateQuery, addUpdateQuery, createUpdateQuery } from "../interfaces/update.interface";
async function getTopics(limit: number = 10, skip: number = 0): Promise<ITopic[]> {
    return await Topic.find()
    .limit(limit)
    .skip(skip)
    .populate({
        path: 'has',
        options: {
            limit: limit,
            skip: skip
        }
    })
    .exec();
}
async function getTopicsByParentId( parent_topic_id: Types.ObjectId, limit: number = 10, skip: number = 0): Promise<ITopic[]> {
    return await Topic.find({parent_topic_id})
    .limit(limit)
    .skip(skip)
    .populate({
        path: 'has',
        options: {
            limit: limit,
            skip: skip
        }
    })
    .exec()
}

async function getTopicsByBoardId(board_id:Types.ObjectId, limit: number = 10, skip: number = 0): Promise<ITopic[]> {
        return await Topic.find({board_id})
        .limit(limit)
        .skip(skip)
        .populate({
            path: 'has',
            options: {
                limit: limit,
                skip: skip
            }
        })
        .exec()
}

async function getTopicById(topicId: Types.ObjectId): Promise<ITopic | null> {
    return await Topic.findById(topicId)
    .populate({
        path: 'has'
    })
    .exec();
}

async function createTopic(topicData: ITopic): Promise<ITopic> {
    const {author_id, board_id} = topicData
    const user = await getUserById(author_id)
    const board = await getBoardById(board_id);
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    const topic = new Topic(topicData)
    const topicObj =  await topic.save();
    if (!topicData.parent_topic_id){
        //add topic id to board
        await updateBoard(board_id, {
            array_operation: {
                field: "topic_ids",
                key: "add",
                value: topicObj._id
            }
        })
    }else{
        //add topic id to the parent topic
        const parentTopic = await getTopicById(topicData.parent_topic_id);
        if (!parentTopic) throw new Error("parent topic is not found")
        if (parentTopic.board_id !== board._id) throw new Error("parent topic is not in the same board")
        if (parentTopic.content_type === 'Task')
            throw new Error("parent content Type is Task not Topic")
        if (!parentTopic.content_type || parentTopic.content_type === 'Topic'){
            await updateTopic(topicData.parent_topic_id, {
                array_operation: {
                    field: "has",
                    key: "add",
                    value: topicObj._id
                },
                content_type: "Topic"
            })
        }
    }
    

    return topicObj;
}

async function updateTopic(topicId: Types.ObjectId, updatedData: IUpdateData): Promise<ITopic | null> {
    const topic = await getTopicById(topicId)
    if (!topic) throw new Error("topic is not found")
    const dataCols = ['title', 'description', 'category', 'content_type', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    const updatedTopic = await Topic.findOneAndUpdate(
    { _id: topicId }, updateQuery, { new: true });
    return updatedTopic
}

async function deleteTopic(topicId: Types.ObjectId): Promise<boolean> {
    const result = await Topic.deleteOne({_id: topicId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

async function addFavoredUser(topicId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserById(userId);
    const topic = await getTopicById(topicId);
    if (!topic) throw new Error("topic is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTopic(topicId, {
        array_operation: {
            field: "favored_by_ids",
            key: "add",
            value: userId
        }
    })
    await updateUser(userId, {
        array_operation: {
            field: "fav_topics",
            key: "add",
            value: topicId
        }
    })
    return true;
}

async function removeFavoredUser(topicId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserById(userId);
    const topic = await getTopicById(topicId);
    if (!topic) throw new Error("topic is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTopic(topicId, {
        array_operation: {
            field: "favored_by_ids",
            key: "remove",
            value: userId
        }
    })
    await updateUser(userId, {
        array_operation: {
            field: "fav_topics",
            key: "remove",
            value: topicId
        }
    })
    return true;
}

async function getFavoredUsers(topicId: Types.ObjectId, limit: number=10, skip: number=0): Promise<Types.ObjectId[] | undefined> {
    const topic = await Topic.findById(topicId).populate({
        path: 'favored_by_ids',
        options: {
            limit: limit,
            skip: skip
        }
    }).exec();
    if(!topic) throw new Error("topic is not found")
    return topic.favored_by_ids;
}

export {
    getTopicsByParentId,
    getTopics,
    getTopicsByBoardId,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    addFavoredUser,
    removeFavoredUser,
    getFavoredUsers
}
