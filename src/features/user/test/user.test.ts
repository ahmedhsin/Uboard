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
import { createBoardService, addFavoredUserService, addMemberToBoardService, getBoardService, deleteBoardService } from '../../board/board.service';
import { createTaskService } from '../../task/task.service';
import { createTopicService, getTopicService } from '../../topic/topic.service';
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
    describe("test the cascade delete", () => {
        let user_id: Types.ObjectId;
        let fav_user_id: Types.ObjectId;
        let mem_user_id: Types.ObjectId;
        let board_id: Types.ObjectId;
        let topic1_id: Types.ObjectId;
        let topic2_id: Types.ObjectId;
        let topic3_id: Types.ObjectId;
        let task1_id: Types.ObjectId;
        let task2_id: Types.ObjectId;
        test("create the board and topics and tasks", async () => {
            const userData = {
                username: "ahmed",
                email: 'sss@gmail.com',
                password_hash: '123456789',
                first_name: 'Test',
                last_name: 'User',
            }
            const user = await createUserService(userData)
            userData.email = 'eee@gmail.com';
            userData.username = 'sami'
            const fav_user = await createUserService(userData)
            userData.email = 'deee@gmail.com'
            userData.username = 'sami2'
            const mem_user = await createUserService(userData)
            user_id = user?._id ?? new Types.ObjectId();
            fav_user_id = fav_user?._id ?? new Types.ObjectId();
            mem_user_id = mem_user?._id ?? new Types.ObjectId();
            const board = await createBoardService({
                title: 'New Board',
                author_id: user_id,
            })
            if (board === null) throw new Error('board is not created');
            board_id = board?._id ?? new Types.ObjectId();
            await addFavoredUserService(board_id, fav_user_id);
            await addMemberToBoardService(board_id, mem_user_id);
            const topicData = {
                title: 'New topic',
                description: 'This is a new topic',
                category: 'New Category',
                author_id: user_id,
                board_id: board_id,
                parent_topic_id: null
            }
            const topic1 = await createTopicService(topicData)
            const topic2 = await createTopicService(topicData)
            const topic3 = await createTopicService(topicData)
            if (topic1 === null) throw new Error('topic is not created');
            topic1_id = topic1?._id ?? new Types.ObjectId();
            topic2_id = topic2?._id ?? new Types.ObjectId();
            topic3_id = topic3?._id ?? new Types.ObjectId();
            const taskData = {
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                author_id: user_id,
                board_id: board_id,
                parent_topic_id: topic1_id
            }
            const task1 = await createTaskService(taskData)
            const task2 = await createTaskService(taskData)
            task1_id = task1?._id ?? new Types.ObjectId();
            task2_id = task2?._id ?? new Types.ObjectId();
        })
        test("check board content", async () => {
            const retBoard = await getBoardService(board_id);
            if (retBoard === null) throw new Error('board is not found');
            expect(retBoard?.topic_ids?.length).toBe(3);
            expect(retBoard?.topic_ids?.includes(topic1_id)).toBe(true);
            expect(retBoard?.topic_ids?.includes(topic2_id)).toBe(true);
            expect(retBoard?.topic_ids?.includes(topic3_id)).toBe(true);
            expect(retBoard?.member_ids?.length).toBe(1);
            expect(retBoard?.member_ids?.includes(mem_user_id)).toBe(true);
            expect(retBoard?.favored_by_ids?.length).toBe(1);
            expect(retBoard?.favored_by_ids?.includes(fav_user_id)).toBe(true);
        })
        test("check users content", async () => {
            const retUser = await getUserService(user_id);
            expect(retUser?.boards?.length).toBe(1);
            expect(retUser?.boards?.includes(board_id)).toBe(true);
            const retFavUser = await getUserService(fav_user_id);
            expect(retFavUser?.fav_boards?.length).toBe(1);
            expect(retFavUser?.fav_boards?.includes(board_id)).toBe(true);
            const retMemUser = await getUserService(mem_user_id);
            expect(retMemUser?.boards?.length).toBe(1);
            expect(retMemUser?.boards?.includes(board_id)).toBe(true);
        });
        test("check topic", async () => {
            const retTopic1 = await getTopicService(topic1_id);
            if (retTopic1 === null) throw new Error('topic is not found');
            expect(retTopic1?.content_type).toBe('Task');
            expect(retTopic1?.has?.length).toBe(2);
            expect(retTopic1?.has?.includes(task1_id)).toBe(true);
            expect(retTopic1?.has?.includes(task2_id)).toBe(true);
        });
        test("delete the user and check the topics and tasks and user", async () => {
            await deleteUserService(user_id);
            const retUser = await getUserService(user_id);
            expect(retUser).toBe(null);
            const retBoard = await getBoardService(board_id);
            expect(retBoard).toBe(null);
            const retTopic1 = await getTopicService(topic1_id);
            expect(retTopic1).toBe(null);
            const retTopic2 = await getTopicService(topic2_id);
            expect(retTopic2).toBe(null);
            const retTopic3 = await getTopicService(topic3_id);
            expect(retTopic3).toBe(null);
            const retTask1 = await getTopicService(task1_id);
            expect(retTask1).toBe(null);
            const retTask2 = await getTopicService(task2_id);
            expect(retTask2).toBe(null);
            const retFavUser = await getUserService(fav_user_id);
            expect(retFavUser?.fav_boards?.length).toBe(0);
            const retMemUser = await getUserService(mem_user_id);
            expect(retMemUser?.boards?.length).toBe(0);

        });
    });
});
