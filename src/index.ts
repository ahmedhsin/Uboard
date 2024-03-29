import userRouter from './routes/user.route'
import boardRouter from './routes/board.route'
import topicRouter from './routes/topic.route'
import taskRouter from './routes/task.route'
import authRouter from './routes/auth.route'
import { Router } from 'express'
const router = Router({mergeParams: true})
router.get('/', (req, res) => {
    res.json({message: 'Welcome to the board API'})
})
router.use('/auth', authRouter)
/*
router.use('/users/:user_id/boards', boardRouter)
router.use('/boards/:board_id/topics', topicRouter)
router.use('/boards/:board_id/topics/:topic_id/tasks', taskRouter)
*/
router.use('/users', userRouter)
router.use('/boards', boardRouter)
router.use('/topics', topicRouter)
router.use('/tasks', taskRouter)
export default router;