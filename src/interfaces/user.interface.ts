import { Types } from "mongoose"
interface IUser{
    username: string
    email: string
    first_name: string
    last_name: string
    password: string
    boards?: Types.ObjectId[]
    fav_boards?: Types.ObjectId[]
    fav_topics?: Types.ObjectId[]
    fav_tasks?: Types.ObjectId[]
    _id?: Types.ObjectId
}
export default IUser;