import { Schema, model } from 'mongoose';
import IUser from './user.interface';

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        minLength: 4,
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
        minLength: 4,
        maxLength: 50
    },
    last_name: {
        type: String,
        required: true,
        minLength: 4,
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

const User = model<IUser>('User', userSchema);

export default User;