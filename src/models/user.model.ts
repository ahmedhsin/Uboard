import { Schema, model } from 'mongoose';
import IUser from '../interfaces/user.interface';
import Board from '../models/board.model';
import Topic from '../models/topic.model';
import Task from '../models/task.model';
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 15
    },
    email: {
        type: String,
        required: true,
        unique:true,
        minLength: 4,
        maxLength: 255
    },
    first_name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    last_name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    password_hash: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 255
    },
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    fav_boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    fav_topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    fav_tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

userSchema.pre('deleteOne', async function(next) {
    try{
        const document = this.getQuery();
        const user: IUser | null = await User.findById(document._id).exec();
        if (user === null) return;
        await Board.deleteMany({ _id: { $in: user.boards } });
    }catch(error: any){
        next(error)
    }
});


const User = model<IUser>('User', userSchema);

export default User;