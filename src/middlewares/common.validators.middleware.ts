import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";

const isIdParams = (name: string) => param(name)
    .notEmpty()
    .withMessage(`${name} is required`)
    .isMongoId()
    .withMessage(`${name} is not valid`);

const isId = (name: string) => body(name)
    .notEmpty()
    .withMessage(`${name} is required`)
    .isMongoId()
    .withMessage(`${name} is not valid`);

const isTitle = () => body('title').notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be a string with length between 1 and 50');

const isDescription = () => body('description')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 0, max: 255 })
    .withMessage('Description must be a string with length between 0 and 255');

const isCategory = () => body('category')
    .isString()
    .withMessage('Category must be a string')
    .isLength({ min: 0, max: 255 })
    .withMessage('Category must be a string with length between 0 and 255');

const isVisibility = () => body('public')
    .isBoolean()
    .withMessage('Public must be a boolean');

const isBool = (val: string) => body(val)
    .isBoolean()
    .withMessage(`${val} must be a boolean`);

const isLimit = () => query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a number between 1 and 100')
    .toInt()
    .custom((value, { req }) => {
        if (req.query?.skip && value < req.query?.skip) {
            throw new Error('Limit must be greater than skip');
        }
        return true;
    })
const isSkip = () => query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a number greater than 0')
    .toInt()

const handelValidation = (req: Request) => {
    const errors = validationResult(req);
    return errors.array().map((i:any) => `${i.msg}`)
}
export {
    isTitle,
    isDescription,
    isCategory,
    isVisibility,
    handelValidation,
    isId,
    isIdParams,
    isBool,
    isLimit,
    isSkip
};