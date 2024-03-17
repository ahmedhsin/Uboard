import { Router } from "express";
import * as boardController from './board.controller' 
import { validate } from "./utils/board.validators";
const router = Router()

router.get('/boards', boardController.getBoardsController);

router.get('/boards/:board_id',validate('getBoard') , boardController.getBoardController);


router.post('/boards', validate("createBoard"), boardController.createBoardController);


router.put('/boards/:board_id', validate('updateBoard'), boardController.updateBoardController);

router.delete('/boards/:board_id', validate('deleteBoard'), boardController.deleteBoardController);


router.get('/boards/:board_id/members', validate('getBoardMembers'), boardController.getBoardMembersController);


router.post('/boards/:board_id/members', validate('addMemberToBoard'), boardController.addMemberToBoardController);


router.delete('/boards/:board_id/members/:member_id', validate('removeMemberFromBoard'), boardController.removeMemberFromBoardController);

router.post('/boards/:board_id/favored_by', validate('addFavoredUser'), boardController.addFavoredUserController);

router.delete('/boards/:board_id/favored_by/:user_id', validate('addFavoredUser'), boardController.removeFavoredUserController);

export default router;