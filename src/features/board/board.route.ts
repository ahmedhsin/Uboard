import { Router } from "express";

const router = Router()

router.get('/boards', (req, res) => {
    res.send('Get a list of all boards');
});

router.get('/boards/:board_id', (req, res) => {
    res.send(`Get details of board with ID ${req.params.board_id}`);
});


router.post('/boards', (req, res) => {
    res.send('Create a new board');
});


router.put('/boards/:board_id', (req, res) => {
    res.send(`Update details of board with ID ${req.params.board_id}`);
});

router.delete('/boards/:board_id', (req, res) => {
    res.send(`Delete board with ID ${req.params.board_id}`);
});


router.get('/boards/:board_id/members', (req, res) => {
    res.send(`Get members of board with ID ${req.params.board_id}`);
});


router.post('/boards/:board_id/members', (req, res) => {
    res.send(`Add a member to board with ID ${req.params.board_id}`);
});


router.delete('/boards/:board_id/members/:member_id', (req, res) => {
    res.send(`Remove member ${req.params.member_id} from board with ID ${req.params.board_id}`);
});

export default router;