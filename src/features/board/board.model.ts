import { Schema, model } from 'mongoose';
import IBoard from './board.interface';
import crypto from 'crypto'
import User from '../user/user.model';
import Topic from '../topic/topic.model';
import { updateBoardService } from './board.service';
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


boardSchema.pre(['deleteMany', 'deleteOne'], async function(next) {
    try {
        const document = this.getQuery();
        const board: IBoard | null = await Board.findById(document._id).exec();
        if (board === null) return;
        await Topic.deleteMany({ _id: { $in: board.topic_ids } });
        await User.updateMany(
            { _id: { $in: board.member_ids } },
            { $pull: { boards: board._id } }
        );
        await User.updateMany(
            { _id: { $in: board.favored_by_ids } },
            { $pull: { fav_boards: board._id } }
        );
        await User.updateOne(
            { _id: board.author_id },
            { $pull: { boards: board._id } }
        );

    } catch (error: any) {
        next(error);
    }
});

const Board = model<IBoard>('Board', boardSchema);

export default Board;