import { Schema, model } from 'mongoose';
import IBoard from './board.interface';
import crypto from 'crypto'
const boardSchema = new Schema<IBoard>({
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
    public: {
        type: Boolean,
        default: true
    },
    author_id: {type: Schema.Types.ObjectId,required:true, ref: 'User'},
    favored_by_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    member_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    topic_ids: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
    key: {
        type: String,
        default: crypto.randomBytes(16).toString("hex"),
        immutable: true
    }
});

const Board = model<IBoard>('Board', boardSchema);

export default Board;