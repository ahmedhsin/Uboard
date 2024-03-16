import { Router } from "express";
import * as topicController from './topic.controller'

const router = Router()


router.get('/topics', topicController.getTopicsController);

router.get('/topics/:topic_id', topicController.getTopicController);

router.post('/topics', topicController.createTopicController);

router.put('/topics/:topic_id', topicController.updateTopicController);

router.delete('/topics/:topic_id', topicController.deleteTopicController);

router.post('/topics/:topic_id/favored_by', topicController.addFavoredUserController);

router.delete('/topics/:topic_id/favored_by/:user_id', topicController.removeFavoredUserController);

export default router;