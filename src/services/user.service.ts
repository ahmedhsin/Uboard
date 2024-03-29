import { Types, UpdateQuery } from "mongoose";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";
import bcrypt from 'bcrypt'
import {IUpdateData, addUpdateQuery, IUpdateQuery, createUpdateQuery } from "../interfaces/update.interface";

async function getUsers(limit: number = 10, skip: number = 0): Promise<IUser[]> {
    return await User.find().select('-password_hash').limit(limit).skip(skip).exec();
}

async function getUserById(user_id: Types.ObjectId): Promise<IUser | null> {
    return await User.findById(user_id).select('-password_hash').exec();
}

async function getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({username: username}).select('-password_hash').exec();
}

async function getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({email: email}).select('-password_hash').exec();
}

async function isPasswordEqual(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

async function createUser(userData: IUser): Promise<IUser> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password_hash, salt)
    userData.password_hash = hashedPassword
    const user = new User(userData);
    const returnedUser =  await user.save()
    return returnedUser;
}

async function updateUser(userId: Types.ObjectId, updatedData: IUpdateData): Promise<IUser | null>{
    const user = await getUserById(userId)
    if (!user) throw new Error("user is not found")
    
    // todo make it generic and secure
    const dataCols = ['username', 'email', 'first_name', 'last_name', 'array_operation']
    const updateQuery = createUpdateQuery(updatedData, dataCols);
    const updatedUser = await User.findOneAndUpdate(
    { _id: userId }, updateQuery, { new: true }).select('-hash_password').exec();
    return updatedUser
}

async function deleteUser(userId: Types.ObjectId): Promise<boolean>{
    const result = await User.deleteOne({_id: userId}).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
}

export {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getUsers,
    updateUser,
    deleteUser,
    createUser,
    isPasswordEqual
}

