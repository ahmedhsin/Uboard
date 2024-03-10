import express, { Express } from 'express';
import routers from './features/index'
import bodyParser from 'body-parser';

const app: Express = express();
app.use(bodyParser.json())
app.use(routers.userRouter)
app.use(routers.boardRouter)
app.use(routers.topicRouter)
app.use(routers.taskRouter)

export default app;