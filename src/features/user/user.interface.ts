import { Types } from "mongoose"
interface IUser{
    username: string
    email: string
    first_name: string
    last_name: string
    password_hash: string
    boards?: Types.ObjectId[]
    fav_boards?: Types.ObjectId[]
    fav_topics?: Types.ObjectId[]
    fav_tasks?: Types.ObjectId[]
}
export default IUser;