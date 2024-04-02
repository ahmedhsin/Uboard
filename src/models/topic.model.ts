import { Schema, model } from 'mongoose';
import ITopic from '../interfaces/topic.interface';
import User from '../models/user.model';
import Task from '../models/task.model';
import Board from '../models/board.model';
import { getTopicById } from '../services/topic.service';

const contentTypeEnum = ["Topic", "Task"] as const
const topicSchema = new Schema<ITopic>({
    title: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true,
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 255,
    },
    category: {
        type: String,
        minlength: 0,
        maxlength: 255,
    },
    author_id: {type: Schema.Types.ObjectId,required:true, ref: 'User'},
    favored_by_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    parent_topic_id: {type: Schema.Types.ObjectId, ref: 'Topic'},
    board_id: {type: Schema.Types.ObjectId,required:true, ref: 'Board'},
    content_type: {type: String, enum: contentTypeEnum},
    has: [{type: Schema.Types.ObjectId, refPath: 'content_type'}]
});


topicSchema.pre(['deleteOne', 'deleteMany'], async function(next) {
    try{
        const document = this.getQuery();
        const topic: ITopic | null = await Topic.findById(document._id).exec();
        if (topic === null) return;
        
        if (topic.content_type === 'Topic')
            await Topic.deleteMany({ _id: { $in: topic.has } });
        else
            await Task.deleteMany({ _id: { $in: topic.has } });
        await User.updateMany(
            { _id: { $in: topic.favored_by_ids } },
            { $pull: { fav_topics: topic._id } }
        );
        if (!topic.parent_topic_id){
            await Board.updateMany(
                { _id: topic.board_id },
                { $pull: { topic_ids: topic._id } }
            );
        }else{
            await Topic.updateMany(
                { _id: topic.parent_topic_id },
                { $pull: { has: topic._id } }
            );
        }
        if (topic.parent_topic_id){
            const RetrievedTopic = await getTopicById(topic.parent_topic_id);
            const hasLength = RetrievedTopic?.has?.length;
            if (hasLength == 0){
                await Topic.updateMany(
                    { _id: topic.parent_topic_id },
                    { $set: {content_type: null} }
                );
            }
        }
    }catch(error: any){
        next(error)
    }
});

const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;