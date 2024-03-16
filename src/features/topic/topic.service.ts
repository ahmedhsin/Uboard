import { Types } from "mongoose";
import ITopic from "./topic.interface";
import Topic from "./topic.model";
import { getUserService, updateUserService } from "../user/user.service";
import { getBoardService, updateBoardService } from "../board/board.service";
import Board from "../board/board.model";
import { IUpdateData, IUpdateQuery, addUpdateQuery, createUpdateQuery } from "../helpers/update.interface";
async function getTopicsService(): Promise<ITopic[]> {
    return await Topic.find();
}

async function getTopicService(topicId: Types.ObjectId): Promise<ITopic | null> {
    return await Topic.findById(topicId)            
}

async function createTopicService(topicData: ITopic): Promise<ITopic> {
    const {author_id, board_id} = topicData
    const user = await getUserService(author_id)
    const board = await getBoardService(board_id);
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    const topic = new Topic(topicData)
    const topicObj =  await topic.save();
    if (!topicData.parent_topic_id){
        //add topic id to board
        await updateBoardService(board_id, {
            array_operation: {
                field: "topic_ids",
                key: "add",
                value: topicObj._id
            }
        })
    }else{
        //add topic id to the parent topic
        const parentTopic = await getTopicService(topicData.parent_topic_id);
        if (!parentTopic) throw new Error("parent topic is not found")
        if (parentTopic.content_type === 'Task')
            throw new Error("parent content Type is Task not Topic")
        if (!parentTopic.content_type || parentTopic.content_type === 'Topic'){
            await updateTopicService(topicData.parent_topic_id, {
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

async function updateTopicService(topicId: Types.ObjectId, updatedData: IUpdateData): Promise<ITopic | null> {
    const topic = await getTopicService(topicId)
    if (!topic) throw new Error("topic is not found")
    const dataCols = ['title', 'description', 'category', 'content_type', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    const updatedTopic = await Topic.findOneAndUpdate(
    { _id: topicId }, updateQuery, { new: true });
    return updatedTopic
}

async function deleteTopicService(topicId: Types.ObjectId): Promise<boolean> {
    const result = await Topic.deleteOne({_id: topicId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

async function addFavoredUserService(topicId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserService(userId);
    const topic = await getTopicService(topicId);
    if (!topic) throw new Error("topic is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTopicService(topicId, {
        array_operation: {
            field: "favored_by_ids",
            key: "add",
            value: userId
        }
    })
    await updateUserService(userId, {
        array_operation: {
            field: "fav_topics",
            key: "add",
            value: topicId
        }
    })
    return true;
}

async function removeFavoredUserService(topicId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    const user = await getUserService(userId);
    const topic = await getTopicService(topicId);
    if (!topic) throw new Error("topic is not found")
    if (!user) throw new Error("author id is not related to a user")
    await updateTopicService(topicId, {
        array_operation: {
            field: "favored_by_ids",
            key: "remove",
            value: userId
        }
    })
    await updateUserService(userId, {
        array_operation: {
            field: "fav_topics",
            key: "remove",
            value: topicId
        }
    })
    return true;
}

export {
    getTopicsService,
    getTopicService,
    createTopicService,
    updateTopicService,
    deleteTopicService,
    addFavoredUserService,
    removeFavoredUserService
}
