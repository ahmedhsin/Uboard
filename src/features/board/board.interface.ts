import { Types } from "mongoose";
interface IBoard{
    title: string
    description?: string
    category?: string
    public?: boolean
    author_id: Types.ObjectId
    favored_by_ids?: Types.ObjectId[]
    member_ids?: Types.ObjectId[]
    topic_ids?: Types.ObjectId[]
    key?: string
}
export default IBoard;