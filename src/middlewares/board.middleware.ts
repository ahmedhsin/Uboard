import { body, param, query, validationResult } from "express-validator";
import { Request } from "express";
import { isTitle, isDescription, isCategory, isVisibility, isIdParams, isId, isLimit, isSkip,
     isUsernameBody, isUsernameParams } from "./common.validators.middleware";
import { isAuthenticated, isBoardMemberOrOwner, isBoardOwner } from "./common.authorization.middleware";

function validate(method: string) {
    switch (method) {
        case 'createBoard': {
            return [
                isAuthenticated,
                isTitle(),
                isDescription().optional(),
                isCategory().optional(),
                isVisibility().optional(),
            ];
        }
        case 'updateBoard': {
            return [
                isAuthenticated,
                isBoardOwner,
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
                isAuthenticated,
                isBoardOwner,
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
                isAuthenticated,
                isBoardOwner,
                isIdParams('board_id'),
                isUsernameBody('username')
            ];
        }
        case 'removeMemberFromBoard': {
            return [
                isAuthenticated,
                isBoardMemberOrOwner,
                isIdParams('board_id'),
                isUsernameParams('username')
            ];
        }
        case 'addFavoredUser': {
            return [
                isAuthenticated,
                isIdParams('board_id'),
            ];
        }
        case 'removeFavoredUser': {
            return [
                isAuthenticated,
                isIdParams('board_id'),
            ];
        }
        case 'paginate': {
            return [
                isLimit(),
                isSkip()
            ]
        }
    }
    return [body()];
}

export {  validate }