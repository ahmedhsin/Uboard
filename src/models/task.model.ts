import { Schema, model } from 'mongoose';
import ITask from '../interfaces/task.interface';
import Topic from '../models/topic.model';
import User from '../models/user.model';

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

taskSchema.pre(['deleteOne', 'deleteMany'], async function(next) {
    try{
        const document = this.getQuery();
        const task: ITask | null = await Task.findById(document._id).exec();
        if (task === null) return;
        await Topic.updateMany(
            { _id: task.parent_topic_id },
            { $pull: { has: task._id } }
        );
        await User.updateMany(
            { _id: { $in: task.favored_by_ids } },
            { $pull: { fav_tasks: task._id } }
        );
        const parentTopic = await Topic.findById(task.parent_topic_id);
        if (parentTopic === null) return;
        const hasLength = parentTopic.has?.length;
        if (hasLength == 0){
            await Topic.findByIdAndUpdate(
                { _id: task.parent_topic_id },
                { $set: { content_type: null } }
            );
        }
    }catch(error: any){
        next(error)
    }
});

const Task = model<ITask>('Task', taskSchema);

export default Task;