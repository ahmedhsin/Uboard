import { Router } from "express";
import * as topicController from './topic.controller'
import { validate } from "./utils/topic.validators";

const router = Router()


router.get('/topics', topicController.getTopicsController);

router.get('/topics/:topic_id',validate('getTopic') , topicController.getTopicController);

router.post('/topics',validate('createTopic') , topicController.createTopicController);

router.put('/topics/:topic_id',validate('updateTopic') , topicController.updateTopicController);

router.delete('/topics/:topic_id',validate('deleteTopic') , topicController.deleteTopicController);

router.post('/topics/:topic_id/favored_by',validate('addFavoredUser') , topicController.addFavoredUserController);

router.delete('/topics/:topic_id/favored_by/:user_id',validate('removeFavoredUser') , topicController.removeFavoredUserController);

export default router;