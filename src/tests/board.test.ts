import mongoose, { Types } from 'mongoose';
import Board from '../board.model';
import {
    getBoardsService,
    getBoardService,
    createBoardService,
    updateBoardService,
    deleteBoardService,
    getBoardMembersService,
    addMemberToBoardService,
    removeMemberFromBoardService,
    addFavoredUserService,
    removeFavoredUserService
} from '../board.service';
import estabishConnection from '../../../config/db';
import User from '../../user/user.model';
import dotenv from 'dotenv';
import { createUserService, getUserService } from '../../user/user.service';
import { createTopicService, getTopicService } from '../../topic/topic.service';
import { createTaskService } from '../../task/task.service';
dotenv.config()
describe('Board Service Tests', () => {
    let boardId: Types.ObjectId;
    let authorId: Types.ObjectId;
    let memberId: Types.ObjectId;

    beforeAll(async () => {
        // Establish database connection
        const dbUrl = process.env.testDB || 'mongodb://localhost:27017/missigEnv';
        await estabishConnection(dbUrl);
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

        // Create a test member
        const memberData = {
            username: 'testmember',
            email: 'testmember@example.com',
            password_hash: '123456789a',
            first_name: 'Test',
            last_name: 'Member',
        };
        const member = new User(memberData);
        const savedMember = await member.save();
        memberId = savedMember._id;
    });

    afterAll(async () => {
        // Delete the test board
        await Board.deleteOne({ _id: boardId });

        // Delete the test user
        await User.deleteOne({ _id: authorId });

        // Delete the test member
        await User.deleteOne({ _id: memberId });

        // Close database connection
        await mongoose.connection.close();
    });

    describe('getBoardsService', () => {
        test('should return an array of boards', async () => {
            const boards = await getBoardsService();
            expect(Array.isArray(boards)).toBe(true);
            expect(boards.length).toBeGreaterThan(0);
        });
    });

    describe('getBoardService', () => {
        test('should return a board by ID', async () => {
            const board = await getBoardService(boardId);
            if (board?._id === undefined) throw new Error('Board is not found');
            expect(typeof board).toBe('object');
            expect(board._id.toString()).toBe(boardId.toString());
        });

        test('should return null for non-existent board', async () => {
            const board = await getBoardService(new Types.ObjectId());
            expect(board).toBe(null);
        });
    });

    describe('createBoardService', () => {
        test('should create a new board', async () => {
            const boardData = {
                title: 'New Board',
                description: 'This is a new board',
                category: 'New Category',
                public: true,
                author_id: authorId,
                member_ids: []
            };
            const createdBoard = await createBoardService(boardData);
            expect(typeof createdBoard).toBe('object');
            expect(createdBoard.title).toBe(boardData.title);
            expect(createdBoard.description).toBe(boardData.description);
            expect(createdBoard.category).toBe(boardData.category);
            expect(createdBoard.public).toBe(boardData.public);
            expect(createdBoard.author_id.toString()).toBe(boardData.author_id.toString());
            expect(Array.isArray(createdBoard.member_ids)).toBe(true);
            expect(createdBoard?.member_ids?.length).toBe(0);

            await Board.deleteOne({ _id: createdBoard._id });
        });

        test('should throw an error for non-existent author', async () => {
            const boardData = {
                title: 'New Board',
                description: 'This is a new board',
                category: 'New Category',
                public: true,
                author_id: new Types.ObjectId(),
                member_ids: []
            };
            await expect(createBoardService(boardData)).rejects.toThrow('author id is not related to a user');
        });

        test('should hash the board key', async () => {
            const boardData = {
                title: 'New Board',
                description: 'This is a new board',
                category: 'New Category',
                public: true,
                author_id: authorId,
                member_ids: [],            };
            const createdBoard = await createBoardService(boardData);
            expect(typeof createdBoard).toBe('object');
            expect(createdBoard.key).not.toBe(undefined);
            await Board.deleteOne({ _id: createdBoard._id });
        });
    });

    describe('updateBoardService', () => {
        test('should update a board', async () => {
            const updatedData = {
                title: 'Updated Board',
                description: 'This is an updated board',
                category: 'Updated Category',
                public: false,
            };
            const updatedBoard = await updateBoardService(boardId, updatedData);
            if (updatedBoard === null) throw new Error('Board is not found');
            expect(typeof updatedBoard).toBe('object');
            expect(updatedBoard.title).toBe(updatedData.title);
            expect(updatedBoard.description).toBe(updatedData.description);
            expect(updatedBoard.category).toBe(updatedData.category);
            expect(updatedBoard.public).toBe(updatedData.public);
        });

        test('should throw an error for non-existent board', async () => {
            const updatedData = {
                title: 'Updated Board',
                description: 'This is an updated board',
                category: 'Updated Category',
                public: false,
            };
            await expect(updateBoardService(new Types.ObjectId(), updatedData)).rejects.toThrow('board is not found');
        });
    });

    describe('deleteBoardService', () => {
        test('should delete a board', async () => {
            const boardData = {
                title: 'New Board',
                description: 'This is a new board',
                category: 'New Category',
                public: true,
                author_id: authorId,
                member_ids: []
            };
            const createdBoard = await createBoardService(boardData);
            if (!createdBoard._id) throw new Error('Failed to create board');
            const result = await deleteBoardService(createdBoard._id);
            expect(result).toBe(true);
        });

        test('should return false for non-existent board', async () => {
            const result = await deleteBoardService(new Types.ObjectId());
            expect(result).toBe(false);
        });
    });

    describe('getBoardMembersService', () => {
        test('should return an array of member IDs', async () => {
            const members = await getBoardMembersService(boardId);
            expect(Array.isArray(members)).toBe(true);
        });

        test('should throw an error for non-existent board', async () => {
            await expect(getBoardMembersService(new Types.ObjectId())).rejects.toThrow('board is not found');
        });
    });

    describe('addMemberToBoardService', () => {
        test('should add a member to the board', async () => {
            const updatedBoard = await addMemberToBoardService(boardId, memberId);
            if (updatedBoard === null) throw new Error('Board is not found');
            expect(Array.isArray(updatedBoard.member_ids)).toBe(true);
            expect(updatedBoard?.member_ids?.length).toBe(1);
            expect(updatedBoard?.member_ids?.[0]?.toString()).toBe(memberId.toString());
            const user = await getUserService(memberId);
            if (user === null) throw new Error('User is not found');
            expect(Array.isArray(user.boards)).toBe(true);
            expect(user?.boards?.length).toBe(1);
            expect(user?.boards?.includes(boardId)).toBe(true);
        });

        test('should throw an error for non-existent board', async () => {
            await expect(addMemberToBoardService(new Types.ObjectId(), memberId)).rejects.toThrow('board is not found');
        });

        test('should throw an error for non-existent member', async () => {
            await expect(addMemberToBoardService(boardId, new Types.ObjectId())).rejects.toThrow('member is not found');
        });
    });

    describe('removeMemberFromBoardService', () => {
        test('should remove a member from the board', async () => {
            const updatedBoard = await removeMemberFromBoardService(boardId, memberId);
            if (updatedBoard === null) throw new Error('Board is not found');
            expect(Array.isArray(updatedBoard.member_ids)).toBe(true);
            expect(updatedBoard?.member_ids?.length).toBe(0);
            const user = await getUserService(memberId);
            if (user === null) throw new Error('User is not found');
            expect(Array.isArray(user.boards)).toBe(true);
            expect(user?.boards?.length).toBe(0);
        });

        test('should throw an error for non-existent board', async () => {
            await expect(removeMemberFromBoardService(new Types.ObjectId(), memberId)).rejects.toThrow('board is not found');
        });

        test('should throw an error for non-existent member', async () => {
            await expect(removeMemberFromBoardService(boardId, new Types.ObjectId())).rejects.toThrow('member is not found');
        });
    });
    describe('add/Remove FavoredUserService',  () => {
        let board_id: Types.ObjectId;
        let user_id: Types.ObjectId;
        test('should add a user to board fav', async () => {
            const user = new User({
                username: 'tes0',
                email: 'tes00@example.com',
                password_hash: '123456789',
                first_name: 'Test',
                last_name: 'User',
            });
            const savedUser = await user.save();
            const board = await createBoardService({
                title: 'New Task',
                description: 'This is a new task',
                category: 'New Category',
                author_id: authorId,
            })
            user_id = savedUser._id;
            if (board?._id === undefined) throw new Error('board is not found');
            board_id = board._id;
            const result = await addFavoredUserService(board._id, savedUser._id);
            expect(result).toBe(true);
            const userRet = await getUserService(savedUser._id);
            if (!userRet?.fav_boards) throw new Error('User is not found');
            expect(userRet.fav_boards.includes(board._id)).toBe(true);
            const boardRet = await getBoardService(board._id);
            if (!boardRet?.favored_by_ids) throw new Error('board is not found');
            expect(boardRet.favored_by_ids.includes(savedUser._id)).toBe(true);
        });

        test('should remove board from fav', async () => {
            const board = await getBoardService(board_id);
            const savedUser = await getUserService(user_id);
            const result = await removeFavoredUserService(board_id, user_id);
            expect(result).toBe(true);
            const userRet = await getUserService(user_id);
            const boardRet = await getBoardService(board_id);
            if (!userRet?.fav_boards) throw new Error('User is not found');
            if (!boardRet?.favored_by_ids) throw new Error('Task is not found');
            expect(userRet.fav_boards.includes(board_id)).toBe(false);
            expect(boardRet.favored_by_ids.includes(user_id)).toBe(false);
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
        test("delete the board and check the topics and tasks and user", async () => {
            await deleteBoardService(board_id);
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
            const retUser = await getUserService(user_id);
            expect(retUser?.boards?.length).toBe(0);
            const retFavUser = await getUserService(fav_user_id);
            expect(retFavUser?.fav_boards?.length).toBe(0);
            const retMemUser = await getUserService(mem_user_id);
            expect(retMemUser?.boards?.length).toBe(0);

        });

    });
});