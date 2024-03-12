import { Schema, model } from 'mongoose';
import ITask from './task.interface';

const taskSchema = new Schema<ITask>({
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
    parent_topic_id: {type: Schema.Types.ObjectId,required:true , ref: 'Topic'},
    board_id: {type: Schema.Types.ObjectId,required:true, ref: 'Board'},
    start_date: {type: Date, default:new Date()},
    end_date: {type: Date},
    notify: {type: Boolean},
    finished: {type: Boolean},
    author_id: {type: Schema.Types.ObjectId, required:true, ref: 'User'},
    favored_by_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    content: {type: String}
});

const Task = model<ITask>('Task', taskSchema);

export default Task;