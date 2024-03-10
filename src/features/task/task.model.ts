import { Schema, model } from 'mongoose';
import ITask from './task.interface';

const taskSchema = new Schema<ITask>({
    title: {type: String},
    description: {type: String},
    category: {type: String},
    parent_topic_id: {type: Schema.Types.ObjectId, ref: 'Topic'},
    board_id: {type: Schema.Types.ObjectId, ref: 'Board'},
    start_date: {type: Date},
    end_date: {type: Date},
    notify: {type: Boolean},
    finished: {type: Boolean},
    public: {type: Boolean},
    author_id: {type: Schema.Types.ObjectId, ref: 'User'},
    favored_by_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    content: {type: String}
});

const Task = model<ITask>('Task', taskSchema);

export default Task;