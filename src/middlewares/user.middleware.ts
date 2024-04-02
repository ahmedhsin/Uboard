import * as userService from '../services/user.service';
import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isIdParams } from '../middlewares/common.validators.middleware';


const isUserName = () => body('username').notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3, max: 15 })
    .withMessage('Username must be a string with length between 3 and 15')
    .custom(async (value) => {
        const user = await userService.getUserByUsername(value);
        if (user) {
            return Promise.reject('Username already exists');
        }
    })
    .withMessage('Username already exists');

const isEmail = () => body('email').notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email')
    .isLength({ min: 4, max: 255 })
    .withMessage('Email must be a string with length between 4 and 255')
    .custom(async (value) => {
        const user = await userService.getUserByEmail(value);
        if (user) {
            return Promise.reject('Email already exists');
        }
    })
    .withMessage('Email already exists');

const isFirstName = () => body('first_name').notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('First name must be a string with length between 3 and 50');

const isLastName = () => body('last_name').notEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('Last name must be a string with length between 3 and 50');

const isPassword = () => body('password_hash').notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 50 })
    .withMessage('Password must be a string with length between 8 and 50');

    function validate(method: string) {
        switch (method) {
            case 'createUser': {
                return [
                    isUserName(),
                    isEmail(),
                    isFirstName(),
                    isLastName(),
                    isPassword()
                ];
            }
            case 'updateUser': {
                return [
                    isUserName(),
                    isEmail(),
                    isFirstName(),
                    isLastName(),
                    isIdParams('user_id')
                ];
            }
            case 'getUser': {
                return [
                    isIdParams('user_id')
                ];
            
            }
            case 'deleteUser': {
                return [
                    isIdParams('user_id')
                ];
            }
        }
        return [body()];
    }
    
export { isUserName, isEmail, isFirstName, isLastName, isPassword, validate};