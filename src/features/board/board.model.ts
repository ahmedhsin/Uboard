import { Schema, model } from 'mongoose';
import IBoard from './board.interface';

const boardSchema = new Schema<IBoard>({
    title: {type: String},
    description: {type: String},
    category: {type: String},
    public: {type: Boolean},
    author_id: {type: Schema.Types.ObjectId, ref: 'User'},
    favored_by_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    member_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
    topic_ids: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
    key: {type: String}
});

const Board = model<IBoard>('Board', boardSchema);

export default Board;