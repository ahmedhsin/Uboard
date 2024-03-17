import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isTitle, isDescription, isCategory, isVisibility, isIdParams, isId, isBool } from "../../utils/common.validators";

const isContent = () => body('content').isString().withMessage('content must be a string').
    isLength({ min: 1, max:2000 }).withMessage('content must be between 1 and 2000 characters')
    .trim()
    .escape();

const isDate = (val: string) => body(val).isDate().withMessage(`${val} must be a date`)
function validate(method: string) {
    switch (method) {
        case 'createTask': {
            return [
                isTitle(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
                isContent(),
                isId('author_id'),
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
                isIdParams('task_id')
            ];
        }
        case 'addFavoredUser': {
            return [
                isIdParams('task_id'),
                isId('user_id')
            ];
        }
        case 'removeFavoredUser': {
            return [
                isIdParams('task_id'),
                isIdParams('user_id')
            ];
        }
    }
    return [body()];
}

export {  validate }
