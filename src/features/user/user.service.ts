import { Types } from "mongoose";
import IUser from "./user.interface";
import User from "./user.model";
async function getUsersService(): Promise<IUser[]> {
    return await User.find();
}

async function getUserService(userId: string): Promise<IUser | null> {
    return await User.findById(userId)
}

async function createUserService(userData: IUser): Promise<IUser> {
    const user = new User(userData);
    return await user.save()
}

function updateUserService(userId: Types.ObjectId): Boolean{
    throw Error("Not Implemented Yet")
}

function deleteUserService(userId: Types.ObjectId): Boolean{
    throw Error("Not Implemented Yet")
}

export {
    getUserService,
    getUsersService,
    updateUserService,
    deleteUserService,
    createUserService
}