import { Types, UpdateQuery } from "mongoose";
import IUser from "./user.interface";
import User from "./user.model";
import bcrypt from 'bcrypt'
import {IUpdateData, addUpdateQuery, IUpdateQuery, createUpdateQuery } from "../helpers/update.interface";
async function getUsersService(): Promise<IUser[]> {
    return await User.find().select('-password_hash').exec();
}

async function getUserService(userId: Types.ObjectId): Promise<IUser | null> {
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

async function updateUserService(userId: Types.ObjectId, updatedData: IUpdateData): Promise<IUser | null>{
    const user = await getUserService(userId)
    if (!user) throw new Error("user is not found")
    
    // todo make it generic and secure
    const dataCols = ['username', 'email', 'first_name', 'last_name', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    const updatedUser = await User.findOneAndUpdate(
    { _id: userId }, updateQuery, { new: true }).select('-hash_password').exec();
    return updatedUser
}

async function deleteUserService(userId: Types.ObjectId): Promise<boolean>{
    const result = await User.deleteOne({_id: userId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

export {
    getUserService,
    getUsersService,
    updateUserService,
    deleteUserService,
    createUserService
}

