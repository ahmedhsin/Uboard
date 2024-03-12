import { Schema, model } from 'mongoose';
import ITopic from './topic.interface';

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


const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;