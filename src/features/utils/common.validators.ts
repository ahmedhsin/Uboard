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
    isBool
};