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
import { getUserService } from '../../user/user.service';
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
});