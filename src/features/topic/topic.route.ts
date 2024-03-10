import { Router } from "express";

const router = Router()


router.get('/topics', (req, res) => {
    res.send('Get a list of all topics');
});


router.get('/topics/:topic_id', (req, res) => {
    res.send(`Get details of topic with ID ${req.params.topic_id}`);
});


router.post('/topics', (req, res) => {
    res.send('Create a new topic');
});


router.put('/topics/:topic_id', (req, res) => {
    res.send(`Update details of topic with ID ${req.params.topic_id}`);
});

router.delete('/topics/:topic_id', (req, res) => {
    res.send(`Delete topic with ID ${req.params.topic_id}`);
});


router.get('/topics/:topic_id/tasks', (req, res) => {
    res.send(`Get tasks associated with topic with ID ${req.params.topic_id}`);
});

export default router;