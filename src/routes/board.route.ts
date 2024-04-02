import { Router } from "express";
import * as boardController from '../controllers/board.controller' 
import { validate } from "../middlewares/board.middleware";
import { isBoardOwner, isBoardMemberOrOwner } from "../middlewares/common.authorization.middleware";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router({mergeParams: true})

router
    .get('/', boardController.getBoards)
    .post('/', boardController.createBoard);

router
    .get('/:board_id', boardController.getBoard)
    .put('/:board_id' ,  boardController.updateBoard)
    .delete('/:board_id',  boardController.deleteBoard);

router
    .get('/:board_id/members', boardController.getBoardMembers)
    .post('/:board_id/members',  boardController.addMemberToBoard);

router.delete('/:board_id/members/:member_id' ,  boardController.removeMemberFromBoard);

router
    .get('/:board_id/favored_by',  boardController.getFavoredUsers)
    .post('/:board_id/favored_by',  boardController.addFavoredUser)
    .delete('/:board_id/favored_by',  boardController.removeFavoredUser);

export default router;