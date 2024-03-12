import { Types, UpdateQuery } from "mongoose";
import IUser from "./user.interface";
import User from "./user.model";
import bcrypt from 'bcrypt'
import {IUpdateData, addUpdateQuery, IUpdateQuery } from "../helpers/update.interface";
async function getUsersService(): Promise<IUser[]> {
    return await User.find().select('-password_hash').exec();
}

async function getUserService(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select('-password_hash').exec();
}

async function createUserService(userData: IUser): Promise<IUser> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password_hash, salt)
    userData.password_hash = hashedPassword
    const user = new User(userData);
    const returnedUser =  await user.save()
    return returnedUser;
}

async function updateUserService(userId: string, updatedData: IUpdateData): Promise<IUser | null>{
    const user = await getUserService(userId)
    if (!user) throw new Error("user is not found")
    const updateQuery: IUpdateQuery = {
        $set: {},
        $pull: {},
        $push:{}
    }
    // todo make it generic and secure
    if (updatedData.username)
        addUpdateQuery(updateQuery, 'username', updatedData.username)
    if (updatedData.email)
        addUpdateQuery(updateQuery, 'email', updatedData.email)
    if (updatedData.first_name)
        addUpdateQuery(updateQuery, 'first_name', updatedData.first_name)
    if (updatedData.last_name)
        addUpdateQuery(updateQuery, 'last_name', updatedData.last_name)
    if (updatedData.array_operation)
        addUpdateQuery(updateQuery, 'array_operation', updatedData.array_operation)
    const updatedUser = await User.findOneAndUpdate(
    { _id: userId }, updateQuery, { new: true }).select('-hash_password').exec();
    return updatedUser
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