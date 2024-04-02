import { Router } from "express";
import * as topicController from '../controllers/topic.controller'
import { validate } from "../middlewares/topic.middleware";

const router = Router({mergeParams: true})


router
    .get('/', topicController.getTopics)
    .post('/',validate('createTopic') , topicController.createTopic);

router
    .get('/:topic_id',validate('getTopic') , topicController.getTopic)
    .put('/:topic_id',validate('updateTopic') , topicController.updateTopic)
    .delete('/:topic_id',validate('deleteTopic') , topicController.deleteTopic);

router
    .get('/:topic_id/favored_by', topicController.getFavoredUsers)
    .post('/:topic_id/favored_by', validate('addFavTopic'), topicController.addFavoredUser)
    .delete('/:topic_id/favored_by', validate('removeFavTopic'), topicController.removeFavoredUser);

export default router;