import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isTitle, isDescription, isCategory, isVisibility, isIdParams, isId } from "../../utils/common.validators";

function validate(method: string) {
    switch (method) {
        case 'createTopic': {
            return [
                isTitle(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
                isId('author_id'),
                isId('parent_topic_id').optional()
            ];
        }
        case 'updateTopic': {
            return [
                isTitle().optional(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
                isIdParams('topic_id')
                
            ];
        }
        case 'getTopic': {
            return [
                isIdParams('topic_id')
            ];
        }
        case 'deleteTopic': {
            return [
                isIdParams('topic_id')
            ];
        }
        case 'addFavoredUser': {
            return [
                isIdParams('topic_id'),
                isId('user_id')
            ];
        }
        case 'removeFavoredUser': {
            return [
                isIdParams('topic_id'),
                isIdParams('user_id')
            ];
        }
    }
    return [body()];
}

export {  validate }
