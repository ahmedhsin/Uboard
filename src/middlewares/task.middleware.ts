import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isTitle, isDescription, isCategory, isVisibility, isIdParams, isId, isBool } from "../middlewares/common.validators.middleware";
import { isAuthenticated, isBoardMemberOrOwner } from "./common.authorization.middleware";

const isContent = () => body('content').isString().withMessage('content must be a string').
    isLength({ min: 1, max:2000 }).withMessage('content must be between 1 and 2000 characters')
    .trim()
    .escape();

const isDate = (val: string) => body(val).isDate().withMessage(`${val} must be a date`)
function validate(method: string) {
    switch (method) {
        case 'createTask': {
            return [
                isAuthenticated,
                isBoardMemberOrOwner,
                isTitle(),
                isDescription().optional(),
                isCategory().optional(),
                isContent(),
                isId('board_id'),
                isId('parent_topic_id'),
                isDate('start_date').optional(),
                isDate('end_date').optional(),
                isBool('notify').optional(),
                isBool('finish').optional()
            ];
        }
        case 'updateTask': {
            return [
                isAuthenticated,
                isBoardMemberOrOwner,
                isTitle().optional(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
                isIdParams('task_id'),
                isDate('end_date').optional(),
                isBool('notify').optional(),
                isBool('finish').optional()
                
            ];
        }
        case 'getTask': {
            return [
                isIdParams('task_id')
            ];
        }
        case 'deleteTask': {
            return [
                isAuthenticated,
                isBoardMemberOrOwner,
                isIdParams('task_id')
            ];
        }
        case 'addFavoredUser': {
            return [
                isAuthenticated,
                isIdParams('task_id'),
            ];
        }
        case 'removeFavoredUser': {
            return [
                isAuthenticated,
                isIdParams('task_id'),
            ];
        }
    }
    return [body()];
}

export {  validate }
