import { Schema, model } from 'mongoose';
import ITopic from './topic.interface';

const topicSchema = new Schema<ITopic>({
    title: {type: String},
    description: {type: String},
    category: {type: String},
    parent_topic_id: {type: Schema.Types.ObjectId, ref: 'Topic'},
    board_id: {type: Schema.Types.ObjectId, ref: 'Board'},
    public: {type: Boolean},
    author_id: {type: Schema.Types.ObjectId, ref: 'User'},
    favored_by_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    content_type: {type: String},
    has: [{type: Schema.Types.ObjectId, refPath: 'content_type'}]
});

const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;