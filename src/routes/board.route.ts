import { Router } from "express";
import * as boardController from '../controllers/board.controller' 
import { validate } from "../middlewares/board.middleware";
import { isBoardOwner, isBoardMemberOrOwner } from "../middlewares/common.authorization.middleware";

const router = Router({mergeParams: true})

router
    .get('/', boardController.getBoards)
    .post('/', validate('createBoard'), boardController.createBoard);

router
    .get('/:board_id', boardController.getBoard)
    .put('/:board_id' , validate('updateBoard'),  boardController.updateBoard)
    .delete('/:board_id', validate('deleteBoard'),  boardController.deleteBoard);

router
    .get('/:board_id/members', boardController.getBoardMembers)
    .post('/:board_id/members', validate('addMemberToBoard'),  boardController.addMemberToBoard);

router.delete('/:board_id/members/:member_id' , validate('removeMemberFromBoard'),  boardController.removeMemberFromBoard);

router
    .get('/:board_id/favored_by',  boardController.getFavoredUsers)
    .post('/:board_id/favored_by', validate('addFavoredUser'),  boardController.addFavoredUser)
    .delete('/:board_id/favored_by', validate('removeFavoredUser'),  boardController.removeFavoredUser);

export default router;