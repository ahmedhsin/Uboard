import { Router } from "express";
import * as topicController from './topic.controller'

const router = Router()


router.get('/topics', topicController.getTopicsController);

router.get('/topics/:topic_id', topicController.getTopicController);

router.post('/topics', topicController.createTopicController);

router.put('/topics/:topic_id', topicController.updateTopicController);

router.delete('/topics/:topic_id', topicController.deleteTopicController);

export default router;