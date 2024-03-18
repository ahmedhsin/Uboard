import express, { Express } from 'express';
import routers from './features/index'
import bodyParser from 'body-parser';
import { initPassport } from './features/auth/auth.passport'

const app: Express = express();
app.use(express.urlencoded({ extended: false }));

initPassport(app)
app.use(bodyParser.json())
app.use(routers.authRouter)
app.use(routers.userRouter)
app.use(routers.boardRouter)
app.use(routers.topicRouter)
app.use(routers.taskRouter)

export default app;