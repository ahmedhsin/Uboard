import { Types } from "mongoose";
interface ITopic{

    title: string
    description: string
    category: string
    parent_topic_id: Types.ObjectId
    board_id: Types.ObjectId
    content_type: string 
    has: Types.ObjectId[]
    public: boolean
    author_id: Types.ObjectId
    favored_by_ids: Types.ObjectId[]
}
export default ITopic;