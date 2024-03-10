import { Router } from "express";

const router = Router()

router.get('/tasks', (req, res) => {
    res.send('Get a list of all tasks');
});

router.get('/tasks/:task_id', (req, res) => {
    res.send(`Get details of task with ID ${req.params.task_id}`);
});

router.post('/tasks', (req, res) => {
    res.send('Create a new task');
});

router.put('/tasks/:task_id', (req, res) => {
    res.send(`Update details of task with ID ${req.params.task_id}`);
});


router.delete('/tasks/:task_id', (req, res) => {
    res.send(`Delete task with ID ${req.params.task_id}`);
});

router.post('/tasks/:task_id/favored_by', (req, res) => {
    res.send(`Add a user to the list of users who favorited task with ID ${req.params.task_id}`);
});

router.delete('/tasks/:task_id/favored_by/:user_id', (req, res) => {
    res.send(`Remove user ${req.params.user_id} from the list of users who favorited task with ID ${req.params.task_id}`);
});

export default router;