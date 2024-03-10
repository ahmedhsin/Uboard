import { Types } from "mongoose";
import ITopic from "./topic.interface";

function getTopicsService(): ITopic[] {
    throw Error("Not Implemented Yet")
}

function getTopicService(topicId: Types.ObjectId): ITopic {
    throw Error("Not Implemented Yet")
}

function createTopicService(topicData: any): ITopic {
    throw Error("Not Implemented Yet")
}

function updateTopicService(topicId: Types.ObjectId, topicData: any): boolean {
    throw Error("Not Implemented Yet")
}

function deleteTopicService(topicId: Types.ObjectId): boolean {
    throw Error("Not Implemented Yet")
}

function getTopicTasksService(topicId: Types.ObjectId): any[] {
    throw Error("Not Implemented Yet")
}

export {
    getTopicsService,
    getTopicService,
    createTopicService,
    updateTopicService,
    deleteTopicService,
    getTopicTasksService
}
