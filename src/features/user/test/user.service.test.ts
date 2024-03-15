import app from '../../../app';
import mongoose, { Types } from 'mongoose';
import User from '../user.model';
import dotenv from 'dotenv';
import {
    getUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    getUsersService
} from '../user.service';
import estabishConnection from '../../../config/db';
dotenv.config();
describe('User Service Tests', () => {
    let userId: Types.ObjectId;

    beforeAll(async () => {
        // Create a test user
        const dbUrl = process.env.testDB || "mongodb://localhost:27017/missigEnv";
        await estabishConnection(dbUrl);
        await mongoose.connection.dropDatabase();
        const hashedPassword = 'testpassword';
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password_hash: hashedPassword,
            first_name: 'Test',
            last_name: 'User',
            array_operation: []
        });
        const savedUser = await user.save();
        userId = savedUser._id;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('getUsersService', () => {
        test('should return an array of users', async () => {
            const users = await getUsersService();
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
        });
    });

    describe('getUserService', () => {
        test('should return a user by ID', async () => {
            const user = await getUserService(userId);
            if (user?._id === undefined) throw new Error('User is not found');
            expect(typeof user).toBe('object');
            expect(user._id.toString()).toBe(userId.toString());
        });

        test('should throw error for non-existent user', async () => {
            const user = await getUserService(new Types.ObjectId());
            expect(user).toBe(null);
        });
    });

    describe('createUserService', () => {
        test('should create a new user', async () => {
            const newUser = {
                username: 'newuser',
                email: 'newuser@example.com',
                password_hash: 'newuserpassword',
                first_name: 'New',
                last_name: 'User',
                array_operation: []
            };
            const createdUser = await createUserService(newUser);
            expect(typeof createdUser).toBe('object');
            expect(createdUser.username).toBe(newUser.username);
            expect(createdUser.email).toBe(newUser.email);
            await User.deleteOne({ _id: createdUser._id });
        });
    });

    describe('updateUserService', () => {
        test('should update a user', async () => {
            const updatedData = {
                username: 'updateduser',
                email: 'updateduser@example.com',
                first_name: 'Updated',
                last_name: 'User',
            };
            const updatedUser = await updateUserService(userId, updatedData);
            if (updatedUser === null) throw new Error('User is not found');
            expect(typeof updatedUser).toBe('object');
            expect(updatedUser.username).toBe(updatedData.username);
            expect(updatedUser.email).toBe(updatedData.email);
        });

        test('should throw an error for non-existent user', async () => {
            try{
                await updateUserService(new Types.ObjectId(), {})
                
            }catch(error: any){
                expect(error.message).toBe('user is not found');
            }
        });
    });
});
