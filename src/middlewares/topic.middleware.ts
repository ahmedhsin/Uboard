import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isTitle, isDescription, isCategory, isVisibility, isIdParams, isId } from "../middlewares/common.validators.middleware";
import { isAuthenticated, isBoardMemberOrOwner } from "./common.authorization.middleware";

function validate(method: string) {
    switch (method) {
        case 'createTopic': {
            return [
                isAuthenticated,
                isBoardMemberOrOwner,
                isTitle(),
                isDescription().optional(),
                isCategory().optional(),
                isId('board_id'),
                isId('parent_topic_id').optional()
            ];
        }
        case 'updateTopic': {
            return [
                isAuthenticated,
                isBoardMemberOrOwner,
                isTitle().optional(),
                isDescription().optional(),
                isCategory().optional(),
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
                isAuthenticated,
                isBoardMemberOrOwner,
                isIdParams('topic_id')
            ];
        }
        case 'addFavoredUser': {
            return [
                isAuthenticated,
                isIdParams('topic_id'),
            ];
        }
        case 'removeFavoredUser': {
            return [
                isAuthenticated,
                isIdParams('topic_id'),
            ];
        }
    }
    return [body()];
}

export {  validate }
