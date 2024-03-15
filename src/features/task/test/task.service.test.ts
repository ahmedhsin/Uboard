import mongoose, { Types } from 'mongoose';
import Task from '../task.model';
import {
    getTasksService,
    getTaskService,
    createTaskService,
    updateTaskService,
    deleteTaskService,
    addFavoredUserService,
    removeFavoredUserService
} from '../task.service';
import { getUserService, updateUserService } from '../../user/user.service';
import { getBoardService } from '../../board/board.service';
import { getTopicService, updateTopicService } from '../../topic/topic.service';
import dotenv from 'dotenv';
import User from '../../user/user.model';
import Board from '../../board/board.model';
import Topic from '../../topic/topic.model';
dotenv.config()

describe('Task Service Tests', () => {
    let taskId: Types.ObjectId;
    let authorId: Types.ObjectId;
    let boardId: Types.ObjectId;
    let topicId: Types.ObjectId;

    beforeAll(async () => {
        // Establish database connection
        const dbUrl = process.env.testDB || 'mongodb://localhost:27017/missigEnv';
        await mongoose.connect(dbUrl);
        await mongoose.connection.dropDatabase();

        // Create a test user
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password_hash: '123456789',
            first_name: 'Test',
            last_name: 'User',
        });
        const savedUser = await user.save();
        authorId = savedUser._id;

        // Create a test board
        const boardData = {
            title: 'Test Board',
            description: 'This is a test board',
            category: 'Test Category',
            public: true,
            author_id: authorId,
            member_ids: []
        };
        const board = new Board(boardData);
        const savedBoard = await board.save();
        boardId = savedBoard._id;

        // Create a test topic
        const topicData = {
            title: 'Test Topic',
            content_type: 'Topic',
            board_id: boardId,
            author_id: authorId,
            parent_topic_id: null,
        };
        const topic = new Topic(topicData);
        const savedTopic = await topic.save();
        topicId = savedTopic._id;
        const task = new Task({
            title: 'Test Task',
            description: 'This is a test task',
            category: 'Test Category',
            end_date: new Date(),
            content: 'Task content',
            author_id: authorId,
            board_id: boardId,
            parent_topic_id: topicId
        });
        await Topic.findByIdAndUpdate(topicId, { content_type: 'Task' }, { new: true })
        const savedTask = await task.save();
        taskId = savedTask._id;
    });

    afterAll(async () => {
        // Delete the test task
        await Task.deleteOne({ _id: taskId });

        // Delete the test user
        await User.deleteOne({ _id: authorId });

        // Delete the test board
        await Board.deleteOne({ _id: boardId });

        // Delete the test topic
        await Topic.deleteOne({ _id: topicId });

        // Close database connection
        await mongoose.connection.close();
    });

    describe('getTasksService', () => {
        test('should return an array of tasks', async () => {
            const tasks = await getTasksService();
            expect(Array.isArray(tasks)).toBe(true);
            expect(tasks.length).toBeGreaterThan(0);
        });
    });

    describe('getTaskService', () => {
        test('should return a task by ID', async () => {
            const task = await getTaskService(taskId);
            if (task?._id === undefined) throw new Error('Task is not found');
            expect(typeof task).toBe('object');
            expect(task._id.toString()).toBe(taskId.toString());
        });

        test('should return null for non-existent task', async () => {
            const task = await getTaskService(new Types.ObjectId());
            expect(task).toBe(null);
        });
    });

    describe('createTaskService', () => {
        test('should create a new task', async () => {
            const taskData = {
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                end_date: new Date(),
                notify: true,
                finished: false,
                content: 'Task content',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: topicId
            };
            const createdTask = await createTaskService(taskData);
            expect(typeof createdTask).toBe('object');
            expect(createdTask.title).toBe(taskData.title);
            expect(createdTask.description).toBe(taskData.description);
            expect(createdTask.category).toBe(taskData.category);
            expect(createdTask.end_date).toEqual(taskData.end_date);
            expect(createdTask.notify).toBe(taskData.notify);
            expect(createdTask.finished).toBe(taskData.finished);
            expect(createdTask.content).toBe(taskData.content);
            expect(createdTask.author_id.toString()).toBe(taskData.author_id.toString());
            expect(createdTask.board_id.toString()).toBe(taskData.board_id.toString());
            expect(createdTask.parent_topic_id.toString()).toBe(taskData.parent_topic_id.toString());
        });

        test('should throw an error for non-existent author', async () => {
            const taskData = {
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                end_date: new Date(),
                notify: true,
                finished: false,
                content: 'Task content',
                author_id: new Types.ObjectId(),
                board_id: boardId,
                parent_topic_id: topicId
            };
            await expect(createTaskService(taskData)).rejects.toThrow('author id is not related to a user');
        });

        test('should throw an error for non-existent board', async () => {
            const taskData = {
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                end_date: new Date(),
                notify: true,
                finished: false,
                content: 'Task content',
                author_id: authorId,
                board_id: new Types.ObjectId(),
                parent_topic_id: topicId
            };
            await expect(createTaskService(taskData)).rejects.toThrow('board is not found');
        });

        test('should throw an error for non-existent topic', async () => {
            const taskData = {
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                end_date: new Date(),
                notify: true,
                finished: false,
                content: 'Task content',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: new Types.ObjectId()
            };
            await expect(createTaskService(taskData)).rejects.toThrow('parent topic is not found');
        });
    });

    describe('updateTaskService', () => {
        test('should update a task', async () => {
            const updatedData = {
                title: 'Updated Task',
                description: 'This is an updated task',
                category: 'Updated Category',
                end_date: new Date(),
                notify: false,
                finished: true,
                content: 'Updated task content',
            };
            const updatedTask = await updateTaskService(taskId, updatedData);
            if (updatedTask === null) throw new Error('Task is not found');
            expect(typeof updatedTask).toBe('object');
            expect(updatedTask.title).toBe(updatedData.title);
            expect(updatedTask.description).toBe(updatedData.description);
            expect(updatedTask.category).toBe(updatedData.category);
            expect(updatedTask.end_date).toEqual(updatedData.end_date);
            expect(updatedTask.notify).toBe(updatedData.notify);
            expect(updatedTask.finished).toBe(updatedData.finished);
            expect(updatedTask.content).toBe(updatedData.content);
        });

        test('should throw an error for non-existent task', async () => {
            const updatedData = {
                title: 'Updated Task',
                description: 'This is an updated task',
                category: 'Updated Category',
                end_date: new Date(),
                notify: false,
                finished: true,
                content: 'Updated task content',
            };
            await expect(updateTaskService(new Types.ObjectId(), updatedData)).rejects.toThrow('task is not found');
        });
    });

    describe('deleteTaskService', () => {
        test('should delete a task', async () => {
            const result = await deleteTaskService(taskId);
            expect(result).toBe(true);
        });

        test('should return false for non-existent task', async () => {
            const result = await deleteTaskService(new Types.ObjectId());
            expect(result).toBe(false);
        });
    });

    describe('add/Remove FavoredUserService',  () => {
        let task_id: Types.ObjectId;
        let user_id: Types.ObjectId;
        test('should add a user to task', async () => {
            const user = new User({
                username: 'testuser00',
                email: 'testuser00@example.com',
                password_hash: '123456789',
                first_name: 'Test',
                last_name: 'User',
            });
            const savedUser = await user.save();
            const task = await createTaskService({
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                end_date: new Date(),
                notify: true,
                finished: false,
                content: 'Task content',
                author_id: authorId,
                board_id: boardId,
                parent_topic_id: topicId
            })
            user_id = savedUser._id;
            if (task?._id === undefined) throw new Error('Task is not found');
            task_id = task._id;
            const result = await addFavoredUserService(task._id, savedUser._id);
            expect(result).toBe(true);
            const userRet = await getUserService(savedUser._id);
            if (!userRet?.fav_tasks) throw new Error('User is not found');
            expect(userRet.fav_tasks.includes(task._id)).toBe(true);
            const taskRet = await getTaskService(task._id);
            if (!taskRet?.favored_by_ids) throw new Error('Task is not found');
            expect(taskRet.favored_by_ids.includes(savedUser._id)).toBe(true);
        });

        test('should remove task from fav', async () => {
            const task = await getTaskService(task_id);
            const savedUser = await getUserService(user_id);
            const result = await removeFavoredUserService(task_id, user_id);
            expect(result).toBe(true);
            const userRet = await getUserService(user_id);
            const taskRet = await getTaskService(task_id);
            if (!userRet?.fav_tasks) throw new Error('User is not found');
            if (!taskRet?.favored_by_ids) throw new Error('Task is not found');
            expect(userRet.fav_tasks.includes(task_id)).toBe(false);
            expect(taskRet.favored_by_ids.includes(user_id)).toBe(false);
        });
    });
});