import { Types } from "mongoose";
interface ITask{
    title: string
    description?: string
    category?: string
    parent_topic_id: Types.ObjectId
    board_id: Types.ObjectId
    start_date?: Date
    end_date?: Date
    notify?: boolean
    finished?: boolean
    author_id: Types.ObjectId
    favored_by_ids?: Types.ObjectId[]
    content?: string
    _id?: Types.ObjectId
}
export default ITask;