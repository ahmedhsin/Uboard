import { Router } from "express";
import * as boardController from './board.controller' 

const router = Router()

router.get('/boards', boardController.getBoardsController);

router.get('/boards/:board_id', boardController.getBoardController);


router.post('/boards', boardController.createBoardController);


router.put('/boards/:board_id', boardController.updateBoardController);

router.delete('/boards/:board_id', boardController.deleteBoardController);


router.get('/boards/:board_id/members', boardController.getBoardMembersController);


router.post('/boards/:board_id/members', boardController.addMemberToBoardController);


router.delete('/boards/:board_id/members/:member_id', boardController.removeMemberFromBoardController);

export default router;