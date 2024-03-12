import { Types } from "mongoose";
import ITopic from "./topic.interface";
import Topic from "./topic.model";
import { getUserService } from "../user/user.service";
import { getBoardService, updateBoardService } from "../board/board.service";
import Board from "../board/board.model";
import { IUpdateData, IUpdateQuery, addUpdateQuery } from "../helpers/update.interface";
async function getTopicsService(): Promise<ITopic[]> {
    return await Topic.find();
}

async function getTopicService(topicId: string): Promise<ITopic | null> {
    return await Topic.findById(topicId)
}

async function createTopicService(topicData: ITopic): Promise<ITopic | null> {
    const {author_id, board_id} = topicData
    const user = await getUserService(String(author_id))
    const board = getBoardService(String(board_id));
    if (!board) throw new Error("board is not found")
    if (!user) throw new Error("author id is not related to a user")
    const topic = new Topic(topicData)
    const topicObj =  await topic.save();
    if (!topicData.parent_topic_id){
        //add topic id to board
        updateBoardService(String(board_id), {
            array_operation: {
                field: "topic_ids",
                key: "add",
                value: topicObj._id
            }
        })
    }else{
        //add topic id to the parent topic
        const parentTopic = await getTopicService(String(topicData.parent_topic_id));
        if (!parentTopic) throw new Error("parent topic is not found")
        if (parentTopic.content_type === 'Task')
            throw new Error("parent content Type is Task not Topic")
        if (!parentTopic.content_type){
            updateTopicService(String(topicData.parent_topic_id), {
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

async function updateTopicService(topicId: string, updatedData: IUpdateData): Promise<ITopic | null> {
    const topic = await getTopicService(topicId)
    if (!topic) throw new Error("topic is not found")
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
    if (updatedData.content_type)
        addUpdateQuery(updateQuery, 'content_type', updatedData.content_type)
    if (updatedData.array_operation)
        addUpdateQuery(updateQuery, 'array_operation', updatedData.array_operation)
    const updatedTopic = await Topic.findOneAndUpdate(
    { _id: topicId }, updateQuery, { new: true });
    return updatedTopic
}

function deleteTopicService(topicId: Types.ObjectId): boolean {
    throw Error("Not Implemented Yet")
}


export {
    getTopicsService,
    getTopicService,
    createTopicService,
    updateTopicService,
    deleteTopicService
}
