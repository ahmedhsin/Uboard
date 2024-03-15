import mongoose, { Types } from 'mongoose';
import Topic from '../topic.model';
import {
    getTopicsService,
    getTopicService,
    createTopicService,
    updateTopicService,
    deleteTopicService,
    addFavoredUserService,
    removeFavoredUserService
} from '../topic.service';
import {  getBoardService } from '../../board/board.service';
import User from '../../user/user.model';
import Board from '../../board/board.model';
import dotenv from 'dotenv';
import { createTaskService } from '../../task/task.service';
import { getUserService } from '../../user/user.service';
dotenv.config()
describe('Topic Service Tests', () => {
    let topicId: Types.ObjectId;
    let authorId: Types.ObjectId;
    let boardId: Types.ObjectId;
    let parentTopicId: Types.ObjectId;

    beforeAll(async () => {
        // Create a test topic
        await mongoose.connect(process.env.testDB || 'mongodb://localhost:27017/missingEnv');
        await mongoose.connection.dropDatabase();
        const user = new User({
            _id: new Types.ObjectId(),
            username: 'testuser',
            email: 'testuser@example.com',
            password_hash: 'testpassword',
            first_name: 'Test',
            last_name: 'User',
        });
        const userObj = await user.save();

        const board = new Board({
            title: 'testboard',
            topic_ids: [],
            author_id: userObj._id
        });
        const boardObj = await board.save();

        const topicData = {
            title: 'testtopic',
            description: 'Test topic description',
            category: 'Test category',
            author_id: userObj._id,
            board_id: boardObj._id
        };
        const topic2Data = {
            title: 'parent topic',
            description: 'Test topic description',
            category: 'Test category',
            author_id: userObj._id,
            board_id: boardObj._id
        };
        const topic = new Topic(topicData);
        const savedTopic = await topic.save();
        const topic2 = new Topic(topic2Data);
        const savedTopic2 = await topic2.save();
        topicId = savedTopic._id;
        authorId = userObj._id;
        boardId = boardObj._id;
        parentTopicId = savedTopic2._id;
    });

    afterAll(async () => {
        await Topic.deleteOne({ _id: topicId }).exec();
        await Board.deleteOne({ _id: boardId }).exec();
        await User.deleteOne({ _id: authorId }).exec();
        await mongoose.connection.close();
    });

    describe('getTopicsService', () => {
        test('should return an array of topics', async () => {
            const topics = await getTopicsService();
            expect(Array.isArray(topics)).toBe(true);
            expect(topics.length).toBeGreaterThan(0);
        });
    });

    describe('getTopicService', () => {
        test('should return a topic by ID', async () => {
            const topic = await getTopicService(topicId);
            expect(topic).toBeDefined();
            expect(topic?._id).toEqual(topicId);
        });

        test('should return null for non-existent topic', async () => {
            const topic = await getTopicService(new Types.ObjectId());
            expect(topic).toBeNull();
        });
    });

    describe('createTopicService', () => {
        test('should create a new topic', async () => {
            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: parentTopicId
            };
            const createdTopic = await createTopicService(topicData);
            expect(createdTopic).toBeDefined();
            expect(createdTopic.title).toBe(topicData.title);
            expect(createdTopic.description).toBe(topicData.description);
            expect(createdTopic.category).toBe(topicData.category);
            expect(createdTopic.author_id).toBe(topicData.author_id);
            expect(createdTopic.board_id).toBe(topicData.board_id);
        });

        test('should throw an error if board is not found', async () => {

            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: authorId,
                board_id: new Types.ObjectId(),
                parent_topic_id: parentTopicId
            };
            await expect(createTopicService(topicData)).rejects.toThrow('board is not found');
        });

        test('should throw an error if author id is not related to a user', async () => {

            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: new Types.ObjectId(),
                board_id: boardId,
                parent_topic_id: parentTopicId
            };
            await expect(createTopicService(topicData)).rejects.toThrow('author id is not related to a user');
        });

        test('should add topic id to board if parent topic id is not provided', async () => {
            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: null
            };
            const createdTopic = await createTopicService(topicData);
            const board = await getBoardService(boardId);
            if (board === null) throw new Error('board is not found');
            expect(board.topic_ids).toContainEqual(createdTopic._id);
        });

        test('should add topic id to parent topic if parent topic id is provided', async () => {
            const parentTopic = {
                title: 'parent topic',
                description: 'Test topic description',
                category: 'Test category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: null,
            };
            const parentTOpicSaved = await new Topic(parentTopic).save();
            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: parentTOpicSaved._id
            };
            const createdTopic = await createTopicService(topicData);
            const getParent = await getTopicService(parentTOpicSaved._id);
            if (getParent === null) throw new Error('parent topic is not found');
            expect(getParent.has).toContainEqual(createdTopic._id);
            expect(getParent.content_type).toBe('Topic');
        });

        test('should throw an error if parent topic is not found', async () => {

            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: new Types.ObjectId()
            };
            await expect(createTopicService(topicData)).rejects.toThrow('parent topic is not found');
        });

        test('should throw an error if parent content type is Task', async () => {
            const parentTopic = {
                title: 'parent topic',
                description: 'Test topic description',
                category: 'Test category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: null,
            };
            const parentTOpicSaved = await new Topic(parentTopic).save();
            const TaskData = {
                title: 'newtask',
                description: 'New task description',
                category: 'New category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: parentTOpicSaved._id
            }
            const createdTask = await createTaskService(TaskData);
            if (createdTask === null) throw new Error('task is not created');
            const topicData = {
                title: 'newtopic',
                description: 'New topic description',
                category: 'New category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: parentTOpicSaved._id
            };
            await expect(createTopicService(topicData)).rejects.toThrow('parent content Type is Task not Topic');
        });
    });

    describe('updateTopicService', () => {
        test('should update a topic', async () => {
            const updatedData = {
                title: 'updatedtopic',
                description: 'Updated topic description',
                category: 'Updated category',
            };
            const updatedTopic = await updateTopicService(topicId, updatedData);
            if (updatedTopic === null) throw new Error('topic is not updated');
            expect(updatedTopic).toBeDefined();
            expect(updatedTopic.title).toBe(updatedData.title);
            expect(updatedTopic.description).toBe(updatedData.description);
            expect(updatedTopic.category).toBe(updatedData.category);
        });

        test('should throw an error for non-existent topic', async () => {
            const nonExistentTopicId = new Types.ObjectId();
            const updatedData = {
                title: 'updatedtopic',
                description: 'Updated topic description',
                category: 'Updated category',
            };
            await expect(updateTopicService(nonExistentTopicId, updatedData)).rejects.toThrow('topic is not found');
        });
    });

    describe('deleteTopicService', () => {
        test('should delete a topic', async () => {
            const result = await deleteTopicService(topicId);
            expect(result).toBe(true);
        });

        test('should return false for non-existent topic', async () => {
            const nonExistentTopicId = new Types.ObjectId();
            const result = await deleteTopicService(nonExistentTopicId);
            expect(result).toBe(false);
        });
    });
    describe('add/Remove FavoredUserService',  () => {
        let topic_id: Types.ObjectId;
        let user_id: Types.ObjectId;
        test('should add a user to topic fav', async () => {
            const user = new User({
                username: 'test0000',
                email: 'testu00@example.com',
                password_hash: '123456789',
                first_name: 'Test',
                last_name: 'User',
            });
            const savedUser = await user.save();
            const topic = await createTopicService({
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: null
            })
            user_id = savedUser._id;
            if (topic?._id === undefined) throw new Error('topic is not found');
            topic_id = topic._id;
            const result = await addFavoredUserService(topic._id, savedUser._id);
            expect(result).toBe(true);
            const userRet = await getUserService(savedUser._id);
            if (!userRet?.fav_topics) throw new Error('User is not found');
            expect(userRet.fav_topics.includes(topic._id)).toBe(true);
            const topicRet = await getTopicService(topic._id);
            if (!topicRet?.favored_by_ids) throw new Error('topic is not found');
            expect(topicRet.favored_by_ids.includes(savedUser._id)).toBe(true);
        });

        test('should remove topic from fav', async () => {
            const topic = await getTopicService(topic_id);
            const savedUser = await getUserService(user_id);
            const result = await removeFavoredUserService(topic_id, user_id);
            expect(result).toBe(true);
            const userRet = await getUserService(user_id);
            const topicRet = await getTopicService(topic_id);
            if (!userRet?.fav_topics) throw new Error('User is not found');
            if (!topicRet?.favored_by_ids) throw new Error('Task is not found');
            expect(userRet.fav_topics.includes(topic_id)).toBe(false);
            expect(topicRet.favored_by_ids.includes(user_id)).toBe(false);
        });
    });
});