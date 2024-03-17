import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isTitle, isDescription, isCategory, isVisibility, isIdParams, isId } from "../../utils/common.validators";

function validate(method: string) {
    switch (method) {
        case 'createBoard': {
            return [
                isTitle(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
                isId('author_id')
            ];
        }
        case 'updateBoard': {
            return [
                isTitle().optional(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
                isIdParams('board_id')
            ];
        }
        case 'getBoard': {
            return [
                isIdParams('board_id')
            ];
        }
        case 'deleteBoard': {
            return [
                isIdParams('board_id')
            ];
        }
        case 'getBoardMembers': {
            return [
                isIdParams('board_id')
            ];
        }
        case 'addMemberToBoard': {
            return [
                isIdParams('board_id'),
                isId('member_id')
            ];
        }
        case 'removeMemberFromBoard': {
            return [
                isIdParams('board_id'),
                isIdParams('member_id')
            ];
        }
        case 'addFavoredUser': {
            return [
                isIdParams('board_id'),
                isId('user_id')
            ];
        }
        case 'removeFavoredUser': {
            return [
                isIdParams('board_id'),
                isIdParams('user_id')
            ];
        }
    }
    return [body()];
}

export {  validate }
